import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMapRenderer from '../components/seat-map/SeatMapRenderer';
import { seatMapConfigs } from '../data/seatMapConfig';
import { ChevronLeftIcon } from '../assets/icons';
import { toast } from 'react-toastify';
import '../components/seat-map/SeatMap.css';

const TripSeatMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tripSeatMap, setTripSeatMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [id, refreshKey]);

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

  const handleSeatSelect = (seatId) => {
    // If it's already booked, don't allow selection
    if (tripSeatMap?.bookedSeats?.includes(seatId)) return;
    
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter(s => s !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleBookTickets = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Vui lòng nhập đầy đủ Họ tên và Số điện thoại');
      return;
    }
    
    setIsBooking(true);
    
    try {
      const promises = selectedSeats.map(seatCode => {
        return fetch('http://localhost:8080/api/v1/tickets/offline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tripId: id,
            seatCode: seatCode,
            customerName: customerName,
            customerPhone: customerPhone
          })
        }).then(async res => {
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || `Lỗi khi đặt ghế ${seatCode}`);
          }
          return res.json();
        });
      });

      await Promise.all(promises);
      toast.success('Đặt vé thành công!');
      setShowModal(false);
      setSelectedSeats([]);
      setCustomerName('');
      setCustomerPhone('');
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra khi đặt vé');
    } finally {
      setIsBooking(false);
    }
  };

  if (loading && !tripSeatMap) {
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

  // Format departureTime
  const depDate = new Date(tripSeatMap.departureTime);
  const formattedTime = !isNaN(depDate) 
    ? `${String(depDate.getHours()).padStart(2, '0')}:${String(depDate.getMinutes()).padStart(2, '0')} - ${String(depDate.getDate()).padStart(2, '0')}/${String(depDate.getMonth() + 1).padStart(2, '0')}/${depDate.getFullYear()}`
    : tripSeatMap.departureTime || 'N/A';
    
  const totalPrice = selectedSeats.length * (tripSeatMap.basePrice || 0);

  return (
    <div className="seatmap-container" style={{ paddingBottom: '100px', position: 'relative', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-6)', gap: 'var(--space-4)' }}>
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
          <h2 style={{ color: 'var(--neutral-900)', margin: 0, fontSize: 'var(--font-size-2xl)' }}>
            Sơ đồ chuyến: {tripSeatMap.route || 'Chưa cập nhật'} | Khởi hành: {formattedTime} | Xe: {tripSeatMap.licensePlate || 'Chưa xếp'}
          </h2>
          <span style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)', display: 'block', marginTop: '4px' }}>
            Chuyến ID: #{tripSeatMap.tripId} - Loại xe: {tripSeatMap.busType === 'LIMOUSINE_34' ? 'Limousine 34 Phòng' : tripSeatMap.busType === 'SLEEPER_40' ? 'Giường Nằm 40' : tripSeatMap.busType}
          </span>
        </div>
      </div>

      <div className="seatmap-legend" style={{ marginBottom: 'var(--space-4)' }}>
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
        <div className="legend-item">
          <div className="legend-box" style={{ 
            backgroundColor: 'var(--warning-100, #ffedd5)', 
            borderColor: 'var(--warning-500, #f97316)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 'bold', color: 'var(--warning-700, #c2410c)'
          }}>WC</div>
          <span>Nhà vệ sinh</span>
        </div>
      </div>

      <SeatMapRenderer
        config={currentConfig}
        selectedSeats={selectedSeats}
        onSeatSelect={handleSeatSelect}
        bookedSeats={tripSeatMap.bookedSeats || []}
      />

      {/* Footer Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '260px', /* Assuming sidebar width */
        right: 0,
        backgroundColor: 'var(--white)',
        borderTop: '1px solid var(--neutral-200)',
        padding: '16px 24px',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '32px' }}>
          <div>
            <span style={{ color: 'var(--neutral-500)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Ghế đang chọn:</span>
            <strong style={{ color: 'var(--neutral-900)', fontSize: '16px' }}>
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Chưa có ghế nào'}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--neutral-500)', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Tổng tiền:</span>
            <strong style={{ color: 'var(--brand-600)', fontSize: '18px' }}>
              {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </strong>
          </div>
        </div>
        
        <button 
          className="btn btn-primary"
          style={{ padding: '12px 24px', fontSize: '16px', borderRadius: '8px' }}
          disabled={selectedSeats.length === 0}
          onClick={() => setShowModal(true)}
        >
          Tiến hành đặt vé
        </button>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px', padding: '24px',
            width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', color: '#111827' }}>Xác nhận đặt vé</h3>
            
            <form onSubmit={handleBookTickets}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Họ tên khách hàng</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Nhập họ tên"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Số điện thoại</label>
                <input 
                  type="tel" 
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D1D5DB', borderRadius: '6px', outline: 'none' }}
                  required
                />
              </div>
              
              <div style={{ backgroundColor: '#F3F4F6', padding: '12px', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '14px', color: '#4B5563' }}>Ghế:</span>
                  <span style={{ fontWeight: '600' }}>{selectedSeats.join(', ')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#4B5563' }}>Tổng cộng:</span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>
                    {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', backgroundColor: 'white', border: '1px solid #D1D5DB', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', color: '#374151' }}
                  disabled={isBooking}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '8px 16px', backgroundColor: '#3B82F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', color: 'white' }}
                  disabled={isBooking}
                >
                  {isBooking ? 'Đang xử lý...' : 'Xác nhận đặt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripSeatMap;
