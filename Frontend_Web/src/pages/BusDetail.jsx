import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMapRenderer from '../components/seat-map/SeatMapRenderer';
import BusLayoutBuilder from '../components/seat-map/BusLayoutBuilder';
import { seatMapConfigs } from '../data/seatMapConfig';
import { ChevronLeftIcon, EditIcon, CloseIcon, SaveIcon } from '../assets/icons';
import EditBusModal from '../components/EditBusModal';
import { useRef } from 'react';
import '../components/seat-map/SeatMap.css';

const BusDetail = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchBusInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/buses/${busId}`);
        if (!response.ok) {
          throw new Error('Không tìm thấy thông tin xe');
        }
        const data = await response.json();
        setBusInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBusInfo();
  }, [busId, refreshTrigger]);

  const getSeatMapConfigKey = (dbBusType) => {
    if (!dbBusType) return null;
    switch (dbBusType) {
      case 'LIMOUSINE_34': return 'limousine34';
      case 'SLEEPER_40': return 'bed40';
      default: return null;
    }
  };

  // Determine current config (priority: DB JSON -> default templates)
  const currentConfig = useMemo(() => {
    if (!busInfo) return null;
    if (busInfo.layoutConfig) {
      try {
        return JSON.parse(busInfo.layoutConfig);
      } catch (e) {
        console.error("Failed to parse layoutConfig", e);
      }
    }
    const key = getSeatMapConfigKey(busInfo.busType);
    return key ? seatMapConfigs[key] : null;
  }, [busInfo]);

  // State for builder mode
  const [isBuilderMode, setIsBuilderMode] = useState(false);
  const [isSavingBuilder, setIsSavingBuilder] = useState(false);
  const builderRef = useRef(null);

  // State for selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Toggle seat selection
  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seatId)) {
        return prevSelected.filter((id) => id !== seatId); // Deselect
      }
      return [...prevSelected, seatId]; // Select
    });
  };


  if (loading) {
    return <div style={{ padding: 'var(--space-6)' }}>Đang tải thông tin xe...</div>;
  }

  if (error || !busInfo || !currentConfig) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <button onClick={() => navigate('/buses')} className="btn" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeftIcon size={20} /> Quay lại danh sách xe
        </button>
        <div>{error || 'Không tìm thấy thông tin xe hoặc dữ liệu sơ đồ ghế.'}</div>
      </div>
    );
  }

  return (
    <div className="seatmap-container" style={{ padding: 'var(--space-6)' }}>
      {/* Header & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            onClick={() => navigate('/buses')} 
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '8px', borderRadius: '50%', backgroundColor: 'var(--neutral-100)',
              color: 'var(--neutral-700)'
            }}
          >
            <ChevronLeftIcon size={20} />
          </button>
          <div>
            <h2 style={{ color: 'var(--neutral-900)', margin: 0, fontSize: 'var(--font-size-2xl)' }}>
              Biển số: {busInfo.licensePlate}
            </h2>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          {isBuilderMode && (
            <button 
              onClick={() => builderRef.current?.save()}
              disabled={isSavingBuilder}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'var(--brand-500)', color: 'white',
                padding: '8px 16px', borderRadius: 'var(--radius-md)',
                fontWeight: 'var(--font-weight-semibold)', border: 'none', cursor: 'pointer',
                opacity: isSavingBuilder ? 0.7 : 1
              }}
            >
              <SaveIcon size={18} />
              {isSavingBuilder ? 'Đang lưu...' : 'Lưu'}
            </button>
          )}

          <button 
            onClick={() => setIsBuilderMode(!isBuilderMode)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: isBuilderMode ? 'var(--neutral-200)' : 'var(--brand-500)',
              color: isBuilderMode ? 'var(--neutral-700)' : 'var(--white)',
              padding: '8px 16px', borderRadius: 'var(--radius-md)',
              fontWeight: 'var(--font-weight-semibold)',
              transition: 'all var(--transition-base)',
              border: isBuilderMode ? '1px solid var(--neutral-300)' : 'none',
              cursor: 'pointer'
            }}
          >
            {isBuilderMode ? (
              <>
                <CloseIcon size={18} /> Hủy chỉnh sửa
              </>
            ) : (
              <>
                <EditIcon size={18} /> Chỉnh sửa sơ đồ
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)', alignItems: 'flex-start' }}>
        
        {/* Column 1: Bus Info Card */}
        <div style={{ 
          flex: '1 1 350px', maxWidth: '400px', backgroundColor: 'var(--white)', 
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', 
          boxShadow: 'var(--shadow-sm)', border: '1px solid var(--neutral-200)' 
        }}>
          {/* Image */}
          <div style={{ 
            width: '100%', height: '220px', backgroundColor: 'var(--neutral-100)', 
            borderRadius: 'var(--radius-md)', overflow: 'hidden', 
            marginBottom: 'var(--space-6)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', border: '1px solid var(--neutral-200)'
          }}>
            {busInfo.imageUrl ? (
              <img src={busInfo.imageUrl} alt={`Xe ${busInfo.licensePlate}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'var(--neutral-400)', fontSize: 'var(--font-size-sm)' }}>Chưa có hình ảnh xe</span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-900)', margin: 0 }}>
              Thông tin chi tiết
            </h3>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--brand-600)', fontWeight: 'var(--font-weight-medium)',
                fontSize: 'var(--font-size-sm)', padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                transition: 'background-color var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--brand-50)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <EditIcon size={16} /> Sửa
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--neutral-200)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Biển số:</span>
              <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-900)' }}>{busInfo.licensePlate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--neutral-200)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Loại xe:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--brand-600)' }}>
                {busInfo.busType === 'LIMOUSINE_34' ? 'Limousine 34 Phòng' : busInfo.busType === 'SLEEPER_40' ? 'Giường Nằm 40' : busInfo.busType}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--neutral-200)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Tổng số ghế:</span>
              <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--brand-600)' }}>{busInfo.totalSeats}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--neutral-200)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Năm sản xuất:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{busInfo.manufactureYear || 'Chưa cập nhật'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--neutral-200)', paddingBottom: '8px' }}>
              <span style={{ color: 'var(--neutral-500)' }}>Màu sắc:</span>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{busInfo.color || 'Chưa cập nhật'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-2)' }}>
              <span style={{ color: 'var(--neutral-500)', fontWeight: 'var(--font-weight-medium)' }}>Mô tả thêm:</span>
              <div style={{ 
                backgroundColor: 'var(--neutral-50)', padding: 'var(--space-3)', 
                borderRadius: 'var(--radius-sm)', color: 'var(--neutral-700)', 
                fontSize: 'var(--font-size-sm)', lineHeight: 'var(--line-height-relaxed)' 
              }}>
                {busInfo.description || 'Không có mô tả.'}
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Layout / Builder */}
        <div style={{ 
          flex: '2 1 500px', backgroundColor: 'var(--white)', 
          borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', 
          boxShadow: 'var(--shadow-sm)', border: '1px solid var(--neutral-200)' 
        }}>
          {isBuilderMode ? (
            <BusLayoutBuilder 
              ref={builderRef}
              busId={busId} 
              busInfo={busInfo}
              existingConfig={currentConfig} 
              onSaveSuccess={(updatedBus) => {
                setBusInfo(updatedBus);
                setIsBuilderMode(false);
              }}
              onSavingChange={(status) => setIsSavingBuilder(status)}
            />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-900)', margin: 0 }}>
                  Sơ đồ ghế
                </h3>
                {/* Legend */}
                <div className="seatmap-legend" style={{ border: 'none', margin: 0, padding: 0 }}>
                  <div className="legend-item">
                    <div className="legend-box available" />
                    <span>Trống</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box selected" />
                    <span>Đang chọn</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-box booked" />
                    <span>Đã bán</span>
                  </div>
                </div>
              </div>
              
              {/* Main Seat Map Renderer */}
              <SeatMapRenderer
                config={currentConfig}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
              />
            </>
          )}
        </div>
      </div>

      {/* Edit Bus Modal */}
      {isEditModalOpen && (
        <EditBusModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          busInfo={busInfo}
          onBusUpdated={() => {
            setRefreshTrigger(prev => prev + 1);
            // Optional: Add toast notification here
          }} 
        />
      )}
    </div>
  );
};

export default BusDetail;