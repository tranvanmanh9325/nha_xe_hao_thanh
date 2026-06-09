import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMapRenderer from '../components/seat-map/SeatMapRenderer';
import BusLayoutBuilder from '../components/seat-map/BusLayoutBuilder';
import { seatMapConfigs } from '../data/seatMapConfig';
import { ChevronLeftIcon } from '../assets/icons';
import '../components/seat-map/SeatMap.css';

const BusDetail = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [busId]);

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
    <div className="seatmap-container">
      {/* Header & Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button 
            onClick={() => navigate('/buses')} 
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '8px', borderRadius: '50%', backgroundColor: 'var(--neutral-100)'
            }}
          >
            <ChevronLeftIcon size={20} />
          </button>
          <div>
            <h2 style={{ color: 'var(--neutral-900)', margin: 0 }}>
              Chi tiết xe: {busInfo.licensePlate}
            </h2>
            <span style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>
              {busInfo.busType === 'LIMOUSINE_34' ? 'Limousine 34 Phòng' : busInfo.busType === 'SLEEPER_40' ? 'Giường Nằm 40' : busInfo.busType}
            </span>
          </div>
        </div>
        {!isBuilderMode && (
          <button className="btn btn-primary" onClick={() => setIsBuilderMode(true)}>
            Chỉnh sửa sơ đồ
          </button>
        )}
      </div>

      {isBuilderMode ? (
        <BusLayoutBuilder 
          busId={busId} 
          existingConfig={currentConfig} 
          onCancel={() => setIsBuilderMode(false)}
          onSaveSuccess={(updatedBus) => {
            setBusInfo(updatedBus);
            setIsBuilderMode(false);
          }}
        />
      ) : (
        <>
          {/* Legend */}
      <div className="seatmap-legend">
        <div className="legend-item">
          <div className="legend-box available" />
          <span>Ghế trống</span>
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

      {/* Main Seat Map Renderer */}
      <SeatMapRenderer
        config={currentConfig}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
      />
      </>
      )}
    </div>
  );
};

export default BusDetail;
