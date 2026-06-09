import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMapRenderer from '../components/seat-map/SeatMapRenderer';
import { seatMapConfigs } from '../data/seatMapConfig';
import { ChevronLeftIcon } from '../assets/icons';
import '../components/seat-map/SeatMap.css';

const TripSeatMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tripSeatMap, setTripSeatMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripSeatMap = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/trips/${id}/seats`);
        if (!response.ok) {
          throw new Error('Không tìm thấy sơ đồ ghế cho chuyến đi này');
        }
        const data = await response.json();
        setTripSeatMap(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTripSeatMap();
  }, [id]);

  const getSeatMapConfigKey = (dbBusType) => {
    if (!dbBusType) return null;
    switch (dbBusType) {
      case 'LIMOUSINE_34': return 'limousine34';
      case 'SLEEPER_40': return 'bed40';
      default: return null;
    }
  };

  const currentConfig = useMemo(() => {
    if (!tripSeatMap) return null;
    if (tripSeatMap.layoutConfig) {
      try {
        return JSON.parse(tripSeatMap.layoutConfig);
      } catch (e) {
        console.error("Failed to parse layoutConfig", e);
      }
    }
    const key = getSeatMapConfigKey(tripSeatMap.busType);
    return key ? seatMapConfigs[key] : null;
  }, [tripSeatMap]);

  if (loading) {
    return <div style={{ padding: 'var(--space-6)' }}>Đang tải sơ đồ chuyến xe...</div>;
  }

  if (error || !tripSeatMap || !currentConfig) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <button onClick={() => navigate('/trips')} className="btn" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: 'none', background: 'none' }}>
          <ChevronLeftIcon size={20} /> Quay lại danh sách chuyến đi
        </button>
        <div>{error || 'Không tìm thấy dữ liệu sơ đồ ghế.'}</div>
      </div>
    );
  }

  return (
    <div className="seatmap-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-4)', gap: 'var(--space-4)' }}>
        <button 
          onClick={() => navigate('/trips')} 
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
            Sơ đồ ghế chuyến đi: #{tripSeatMap.tripId}
          </h2>
          <span style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>
            Biển số: {tripSeatMap.licensePlate || 'Chưa cập nhật'} - {tripSeatMap.busType === 'LIMOUSINE_34' ? 'Limousine 34 Phòng' : tripSeatMap.busType === 'SLEEPER_40' ? 'Giường Nằm 40' : tripSeatMap.busType}
          </span>
        </div>
      </div>

      <div className="seatmap-legend">
        <div className="legend-item">
          <div className="legend-box available" />
          <span>Ghế trống</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked" />
          <span>Đã bán</span>
        </div>
      </div>

      <SeatMapRenderer
        config={currentConfig}
        selectedSeats={[]}
        onSeatSelect={() => {}}
        bookedSeats={tripSeatMap.bookedSeats || []}
      />
    </div>
  );
};

export default TripSeatMap;
