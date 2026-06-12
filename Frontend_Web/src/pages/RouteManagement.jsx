import { useState, useEffect } from 'react';
import { PlusIcon, TrashIcon, PauseIcon, PlayIcon, EditIcon } from '../assets/icons';
import ConfirmModal from '../components/ui/ConfirmModal';
import RouteFormModal from '../components/RouteFormModal';
import { toast } from 'react-toastify';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    routeToDelete: null
  });

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/routes');
        if (!response.ok) {
          throw new Error('Lỗi khi tải danh sách tuyến đường');
        }
        const data = await response.json();
        setRoutes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, [refreshKey]);

  const handleToggleStatus = async (e, route) => {
    e.stopPropagation();
    const newStatus = route.status === 'Đang hoạt động' ? 'Tạm ngưng' : 'Đang hoạt động';
    try {
      const response = await fetch(`http://localhost:8080/api/v1/routes/${route.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error('Không thể cập nhật trạng thái tuyến');
      setRoutes(prev => prev.map(r => r.id === route.id ? { ...r, status: newStatus } : r));
      toast.success(`Đã cập nhật trạng thái thành: ${newStatus}`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  const requestDelete = (e, route) => {
    e.stopPropagation();
    setConfirmModal({ isOpen: true, routeToDelete: route });
  };

  const handleConfirmDelete = async () => {
    const route = confirmModal.routeToDelete;
    if (!route) return;
    try {
      const response = await fetch(`http://localhost:8080/api/v1/routes/${route.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Không thể xóa tuyến đường');
      }
      toast.success('Xóa tuyến đường thành công!');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="page-container" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: '600', color: 'var(--neutral-900)' }}>Quản lý tuyến đường</h1>
          <p style={{ color: 'var(--neutral-500)', marginTop: 'var(--space-1)' }}>
            Quản lý danh sách các tuyến xe cố định của nhà xe.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => { setSelectedRoute(null); setIsModalOpen(true); }}
          style={{ 
            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
            backgroundColor: 'var(--brand-500)', color: 'white',
            padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)',
            fontWeight: '500', transition: 'background-color var(--transition-fast)',
            cursor: 'pointer', border: 'none'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-600)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-500)'}
        >
          <PlusIcon size={20} />
          <span>Thêm tuyến đường</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--neutral-500)' }}>
          Đang tải danh sách tuyến đường...
        </div>
      ) : error ? (
        <div style={{ padding: 'var(--space-4)', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          {error}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
          {routes.map((route) => (
            <div key={route.id} className="card" style={{ 
              backgroundColor: 'white', borderRadius: 'var(--radius-lg)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: '1px solid var(--neutral-200)', display: 'flex', flexDirection: 'column'
            }}>
              <div style={{ padding: 'var(--space-4)', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--neutral-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{route.routeCode}</span>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--primary-color)', marginTop: '4px' }}>
                      {route.origin} - {route.destination}
                    </h3>
                  </div>
                  <span style={{
                    padding: '4px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: '500',
                    backgroundColor: route.status === 'Đang hoạt động' ? '#dcfce7' : '#fee2e2',
                    color: route.status === 'Đang hoạt động' ? '#166534' : '#991b1b'
                  }}>
                    {route.status}
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--neutral-600)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>
                  {route.distance != null && <span>Quãng đường: {route.distance} km</span>}
                  {route.estimatedDuration != null && <span>Thời gian: {route.estimatedDuration} giờ</span>}
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', 
                borderTop: '1px solid var(--neutral-100)', padding: 'var(--space-3)' 
              }}>
                <button
                  onClick={(e) => handleToggleStatus(e, route)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)', fontWeight: '500', backgroundColor: 'white', color: 'var(--neutral-700)',
                    border: '1px solid var(--neutral-300)', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--neutral-50)'; e.currentTarget.style.color = 'var(--neutral-900)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = 'var(--neutral-700)'; }}
                >
                  {route.status === 'Đang hoạt động' ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
                  {route.status === 'Đang hoạt động' ? 'Tạm ngưng' : 'Mở hoạt động'}
                </button>
                <button
                  onClick={() => handleEdit(route)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)', fontWeight: '500', backgroundColor: 'white', color: 'var(--brand-600)',
                    border: '1px solid var(--brand-200)', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <EditIcon size={16} />
                  Sửa
                </button>
                <button
                  onClick={(e) => requestDelete(e, route)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)', fontWeight: '500', backgroundColor: 'white', color: '#ef4444',
                    border: '1px solid var(--neutral-300)', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#fca5a5'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'var(--neutral-300)'; }}
                >
                  <TrashIcon size={16} />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <RouteFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedRoute}
          onSaved={() => setRefreshKey(prev => prev + 1)}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, routeToDelete: null })}
        onConfirm={handleConfirmDelete}
        title="Xóa tuyến đường"
        message="Bạn có chắc chắn muốn xóa tuyến đường này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default RouteManagement;
