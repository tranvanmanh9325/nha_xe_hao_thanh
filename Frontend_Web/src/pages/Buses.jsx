import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, PauseIcon, PlayIcon } from '../assets/icons';
import AddBusModal from '../components/AddBusModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { authFetch } from '../utils/authService';
import { toast } from 'react-toastify';

const Buses = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    busToDelete: null
  });

  useEffect(() => {
    // Fetch buses from backend API
    const fetchBuses = async () => {
      try {
        const response = await authFetch('http://localhost:8080/api/v1/buses');
        if (!response.ok) {
          throw new Error('Lỗi khi tải danh sách xe từ máy chủ');
        }
        const data = await response.json();
        setBuses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, [refreshKey]);

  const handleToggleStatus = async (e, bus) => {
    e.stopPropagation();
    const newStatus = bus.status === 'Đang hoạt động' ? 'Tạm ngưng' : 'Đang hoạt động';
    try {
      const response = await authFetch(`http://localhost:8080/api/v1/buses/${bus.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái xe');
      }
      
      // Update local state for immediate feedback
      setBuses(prevBuses => 
        prevBuses.map(b => b.id === bus.id ? { ...b, status: newStatus } : b)
      );
      toast.success(`Đã cập nhật trạng thái xe thành: ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const requestDeleteBus = (e, bus) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      busToDelete: bus
    });
  };

  const handleConfirmDelete = async () => {
    const bus = confirmModal.busToDelete;
    if (!bus) return;
    
    try {
      const response = await authFetch(`http://localhost:8080/api/v1/buses/${bus.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Không thể xóa xe');
      }
      
      toast.success('Xóa xe thành công!');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      let errorMessage = err.message || 'Có lỗi xảy ra khi xóa xe.';
      if (err.message && err.message.startsWith('{')) {
        try {
          const errorObj = JSON.parse(err.message);
          if (errorObj.status === 500) {
            errorMessage = 'Không thể xóa xe này vì xe đã được lên lịch chuyến đi.';
          } else if (errorObj.message) {
            errorMessage = errorObj.message;
          }
        } catch (parseErr) {
          console.debug('Không thể parse lỗi JSON:', parseErr);
        }
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="page-container" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: 'var(--neutral-900)' }}>Quản lý xe</h1>
          <p style={{ color: 'var(--neutral-500)', marginTop: 'var(--space-1)' }}>Quản lý danh sách các xe và xem chi tiết sơ đồ ghế.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsAddModalOpen(true)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)',
            backgroundColor: 'var(--brand-500)',
            color: 'white',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            fontWeight: '500',
            transition: 'background-color var(--transition-fast)',
            cursor: 'pointer',
            border: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-600)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-500)'}
        >
          <PlusIcon size={20} />
          <span>Thêm xe mới</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--neutral-500)' }}>
          Đang tải danh sách xe...
        </div>
      ) : error ? (
        <div style={{ padding: 'var(--space-4)', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          {error}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          {buses.map((bus) => (
            <div 
              key={bus.id} 
              className="card"
              style={{ 
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid var(--neutral-200)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={() => navigate(`/admin/buses/${bus.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              {/* Image Section */}
              <div style={{ height: '200px', backgroundColor: 'var(--neutral-100)', position: 'relative' }}>
                {bus.imageUrl ? (
                  <img 
                    src={bus.imageUrl} 
                    alt={bus.licensePlate} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-400)' }}>
                    Chưa có ảnh
                  </div>
                )}
                <span style={{
                  position: 'absolute',
                  top: 'var(--space-3)',
                  right: 'var(--space-3)',
                  padding: '4px 8px',
                  borderRadius: '999px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: '500',
                  backgroundColor: bus.status === 'Đang hoạt động' ? '#dcfce7' : '#fee2e2',
                  color: bus.status === 'Đang hoạt động' ? '#166534' : '#991b1b',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {bus.status}
                </span>
              </div>
              
              {/* Content Section */}
              <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--primary-color)' }}>{bus.licensePlate}</h3>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)', marginTop: '4px', lineHeight: '1.5' }}>
                    <span>
                      {bus.busType === 'LIMOUSINE_34' ? 'Limousine 34 Phòng' : 
                       bus.busType === 'SLEEPER_40' ? 'Giường Nằm 40' : 
                       bus.busType === 'SEAT_28' ? 'Ghế Ngồi 28' : bus.busType}
                    </span>
                    {bus.color && (
                      <>
                        <span style={{ margin: '0 6px' }}>•</span>
                        <span>{bus.color}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--neutral-100)', paddingTop: 'var(--space-3)', marginTop: 'auto' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)' }}>Tổng số ghế:</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--neutral-900)' }}>{bus.totalSeats}</span>
                </div>
                
                {/* Actions Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 'var(--space-2)', 
                  borderTop: '1px solid var(--neutral-100)', 
                  paddingTop: 'var(--space-3)', 
                  marginTop: 'var(--space-3)' 
                }}>
                  <button
                    onClick={(e) => handleToggleStatus(e, bus)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      backgroundColor: 'white',
                      color: 'var(--neutral-700)',
                      border: '1px solid var(--neutral-300)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                      e.currentTarget.style.color = 'var(--neutral-900)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.color = 'var(--neutral-700)';
                    }}
                  >
                    {bus.status === 'Đang hoạt động' ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                    {bus.status === 'Đang hoạt động' ? 'Tạm ngưng' : 'Mở hoạt động'}
                  </button>

                  <button
                    onClick={(e) => requestDeleteBus(e, bus)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500',
                      backgroundColor: 'white',
                      color: '#ef4444',
                      border: '1px solid var(--neutral-300)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fca5a5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.borderColor = 'var(--neutral-300)';
                    }}
                  >
                    <TrashIcon size={16} />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Thêm Xe Mới */}
      <AddBusModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onBusAdded={() => setRefreshKey(prev => prev + 1)}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, busToDelete: null })}
        onConfirm={handleConfirmDelete}
        title="Xóa xe"
        message="Bạn có chắc chắn muốn xóa xe này? Chỉ có thể xóa xe chưa từng được lên lịch chuyến đi."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default Buses;