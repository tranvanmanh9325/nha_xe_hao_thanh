import { useState, useMemo } from 'react';
import SeatMapRenderer from '../components/seat-map/SeatMapRenderer';
import { seatMapConfigs } from '../data/seatMapConfig';
import '../components/seat-map/SeatMap.css';

const SeatMap = () => {
  // State for switching vehicle types
  const [activeVehicleId, setActiveVehicleId] = useState('limousine34');
  
  // State for selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);

  const currentConfig = seatMapConfigs[activeVehicleId];

  // Toggle seat selection
  const handleSeatSelect = (seatId) => {
    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(seatId)) {
        return prevSelected.filter((id) => id !== seatId); // Deselect
      }
      return [...prevSelected, seatId]; // Select
    });
  };

  // Switch vehicle type (and clear selections)
  const handleVehicleSwitch = (vehicleId) => {
    setActiveVehicleId(vehicleId);
    setSelectedSeats([]);
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

  if (!currentConfig) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="seatmap-container">
      <h2 style={{ marginBottom: '8px', color: 'var(--neutral-900)' }}>
        Mô phỏng Sơ đồ ghế (Dynamic Layout)
      </h2>
      
      {/* Tabs to switch vehicle type */}
      <div className="seatmap-tabs">
        {Object.values(seatMapConfigs).map((vehicle) => (
          <button
            key={vehicle.id}
            className={`seatmap-tab ${activeVehicleId === vehicle.id ? 'active' : ''}`}
            onClick={() => handleVehicleSwitch(vehicle.id)}
          >
            {vehicle.name}
          </button>
        ))}
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

export default SeatMap;
