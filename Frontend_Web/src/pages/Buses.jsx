import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '../assets/icons';
import AddBusModal from '../components/AddBusModal';

const Buses = () => {
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Fetch buses from backend API
    const fetchBuses = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/buses');
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
                padding: 'var(--space-4)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                border: '1px solid var(--neutral-200)',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onClick={() => navigate(`/buses/${bus.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--primary-color)' }}>{bus.licensePlate}</h3>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-500)' }}>{bus.busType}</span>
                </div>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '999px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: '500',
                  backgroundColor: bus.status === 'Đang hoạt động' ? '#dcfce7' : '#fee2e2',
                  color: bus.status === 'Đang hoạt động' ? '#166534' : '#991b1b'
                }}>
                  {bus.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--neutral-100)', paddingTop: 'var(--space-3)', marginTop: 'auto' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--neutral-600)' }}>Tổng số ghế:</span>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--neutral-900)' }}>{bus.totalSeats}</span>
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
    </div>
  );
};

export default Buses;
