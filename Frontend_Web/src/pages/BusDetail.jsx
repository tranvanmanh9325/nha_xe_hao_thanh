import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMapRenderer from '../components/seat-map/SeatMapRenderer';
import { seatMapConfigs } from '../data/seatMapConfig';
import { ChevronLeftIcon } from '../assets/icons';
import '../components/seat-map/SeatMap.css';

// Mock data to map busId to the correct seatMapConfig
const MOCK_BUSES = [
  { id: 'bus-01', licensePlate: '51B-123.45', typeId: 'limousine34', typeName: 'Limousine 34 Phòng' },
  { id: 'bus-02', licensePlate: '29B-987.65', typeId: 'bed40', typeName: 'Giường Nằm 40' },
  { id: 'bus-03', licensePlate: '51B-555.55', typeId: 'limousine34', typeName: 'Limousine 34 Phòng' },
  { id: 'bus-04', licensePlate: '43B-111.11', typeId: 'bed40', typeName: 'Giường Nằm 40' },
];

const BusDetail = () => {
  const { busId } = useParams();
  const navigate = useNavigate();

  // Find the bus info
  const bus = MOCK_BUSES.find((b) => b.id === busId);
  const currentConfig = bus ? seatMapConfigs[bus.typeId] : null;

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

  // Compute total price based on selected seats and base price
  const totalPrice = useMemo(() => {
    if (!currentConfig) return 0;
    return selectedSeats.length * currentConfig.basePrice;
  }, [selectedSeats, currentConfig]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (!bus || !currentConfig) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <button onClick={() => navigate('/buses')} className="btn" style={{ marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ChevronLeftIcon size={20} /> Quay lại danh sách xe
        </button>
        <div>Không tìm thấy thông tin xe hoặc dữ liệu sơ đồ ghế.</div>
      </div>
    );
  }

  return (
    <div className="seatmap-container">
      {/* Header & Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
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
            Chi tiết xe: {bus.licensePlate}
          </h2>
          <span style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>{bus.typeName}</span>
        </div>
      </div>

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

      {/* Info Panel / Summary */}
      <div className="seatmap-info-panel">
        <div className="info-row">
          <span className="info-label">Chuyến xe:</span>
          <span className="info-value">{currentConfig.name}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Ghế đã chọn:</span>
          <div className="info-value">
            {selectedSeats.length > 0 ? (
              selectedSeats.map((seatId) => (
                <span key={seatId} className="seat-badge">
                  {seatId}
                </span>
              ))
            ) : (
              <span className="text-muted">Chưa chọn ghế</span>
            )}
          </div>
        </div>
        <div className="info-row" style={{ marginTop: 'var(--space-2)' }}>
          <span className="info-label">Tổng tiền:</span>
          <span className="info-value price">{formatCurrency(totalPrice)}</span>
        </div>
        
        <button
          className="book-btn"
          disabled={selectedSeats.length === 0}
          onClick={() => {
            alert(`Đã đặt các ghế: ${selectedSeats.join(', ')} \nTổng tiền: ${formatCurrency(totalPrice)}`);
            setSelectedSeats([]);
          }}
        >
          {selectedSeats.length > 0 ? 'Xác nhận đặt ghế' : 'Vui lòng chọn ghế'}
        </button>
      </div>
    </div>
  );
};

export default BusDetail;
