import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { authFetch } from '../../utils/authService';
import SeatMapRenderer from '../seat-map/SeatMapRenderer';
import { seatMapConfigs } from '../../data/seatMapConfig';

const AdminBookingModal = ({ isOpen, onClose, trip, onSuccess }) => {
  const [tripSeatMap, setTripSeatMap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropoffPoint, setDropoffPoint] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (!isOpen || !trip) return;
    
    const fetchSeatMap = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await authFetch(`http://localhost:8080/api/v1/trips/${trip.id}/seats`);
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
    
    fetchSeatMap();
  }, [isOpen, trip]);

  const currentConfig = useMemo(() => {
    if (!tripSeatMap) return null;
    if (tripSeatMap.layoutConfig) {
      try {
        return JSON.parse(tripSeatMap.layoutConfig);
      } catch (e) {
        console.error("Failed to parse layoutConfig", e);
      }
    }
    const getSeatMapConfigKey = (dbBusType) => {
      if (!dbBusType) return null;
      switch (dbBusType) {
        case 'LIMOUSINE_34': return 'limousine34';
        case 'SLEEPER_40': return 'bed40';
        default: return null;
      }
    };
    const key = getSeatMapConfigKey(tripSeatMap.busType);
    return key ? seatMapConfigs[key] : null;
  }, [tripSeatMap]);

  const handleSeatSelect = (seatId) => {
    if (!isTripActive) return;
    if (tripSeatMap?.bookedSeats?.includes(seatId)) return;
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) return prev.filter(s => s !== seatId);
      return [...prev, seatId];
    });
  };

  const handleBookTickets = async (e) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error('Vui lòng nhập đầy đủ Họ tên và Số điện thoại');
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error('Vui lòng chọn ít nhất một ghế');
      return;
    }
    
    setIsBooking(true);
    try {
      const response = await authFetch('http://localhost:8080/api/v1/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: trip.id,
          customerName: customerName,
          customerPhone: customerPhone,
          pickupPoint: pickupPoint,
          dropoffPoint: dropoffPoint,
          notes: notes,
          paymentStatus: paymentStatus,
          totalPrice: totalPrice,
          seatNumbers: selectedSeats
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.message || 'Có lỗi xảy ra khi đặt vé');
      }

      await response.json();
      toast.success('Đặt vé thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra khi đặt vé');
    } finally {
      setIsBooking(false);
    }
  };

  if (!isOpen || !trip) return null;

  const depDate = new Date(trip.departureTime);
  const formattedTime = !isNaN(depDate) 
    ? `${String(depDate.getHours()).padStart(2, '0')}:${String(depDate.getMinutes()).padStart(2, '0')} - ${String(depDate.getDate()).padStart(2, '0')}/${String(depDate.getMonth() + 1).padStart(2, '0')}/${depDate.getFullYear()}`
    : trip.departureTime || 'N/A';

  const basePrice = tripSeatMap?.basePrice || trip.basePrice || 0;
  const totalPrice = selectedSeats.length * basePrice;
  const isTripActive = trip.status === 'SCHEDULED';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Đặt vé & Giữ chỗ (Tổng đài / Tại quầy)</h2>
            <p className="text-sm text-slate-500 mt-1">Chuyến: <span className="font-semibold text-brand-600">{trip.route}</span> | Khởi hành: {formattedTime}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Split */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Column: Seat Map (60%) */}
          <div className="w-[60%] flex flex-col bg-slate-50 border-r border-slate-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-semibold text-slate-800">Sơ đồ ghế</h3>
                  <p className="text-sm text-slate-500">Xe: {trip.licensePlate || 'Chưa xếp xe'} - {tripSeatMap?.busType?.replace('_', ' ') || 'N/A'}</p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white border-2 border-slate-300"></div>
                    <span className="text-slate-600">Trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-brand-500 border-2 border-brand-600 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                    <span className="text-slate-600">Đang chọn</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200 border-2 border-slate-300 opacity-60"></div>
                    <span className="text-slate-600">Đã bán</span>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                  <span className="ml-3 text-slate-500">Đang tải sơ đồ ghế...</span>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
                  {error}
                </div>
              ) : currentConfig ? (
                <div className="flex justify-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
                  <div className="transform scale-90 origin-top">
                    <SeatMapRenderer
                      config={currentConfig}
                      selectedSeats={selectedSeats}
                      onSeatSelect={handleSeatSelect}
                      bookedSeats={tripSeatMap?.bookedSeats || []}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 bg-white rounded-xl border border-slate-200">
                  Không có cấu hình sơ đồ ghế
                </div>
              )}
            </div>
          </div>

          {/* Right Column: POS Form (40%) */}
          <div className="w-[40%] flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300">
              
              {/* Trip Summary Card */}
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-brand-900">Thông tin đặt vé</h3>
                  <span className="text-brand-600 font-bold bg-white px-2 py-1 rounded-md text-sm border border-brand-200">
                    {basePrice.toLocaleString('vi-VN')} ₫/ghế
                  </span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-brand-100">
                  <span className="text-slate-600 text-sm">Ghế đang chọn:</span>
                  <span className="font-bold text-slate-800 text-lg">
                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : <span className="text-slate-400 text-sm font-normal">Chưa chọn ghế</span>}
                  </span>
                </div>
              </div>

              {/* Customer Form */}
              <form id="pos-booking-form" onSubmit={handleBookTickets} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Thông tin khách hàng</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                        required
                        disabled={!isTripActive}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="0912345678"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                        required
                        disabled={!isTripActive}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Điểm đón</label>
                      <input 
                        type="text" 
                        value={pickupPoint}
                        onChange={(e) => setPickupPoint(e.target.value)}
                        placeholder="VD: Đón tại nhà, Ngã 4, Dọc quốc lộ..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                        disabled={!isTripActive}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Điểm trả</label>
                      <input 
                        type="text" 
                        value={dropoffPoint}
                        onChange={(e) => setDropoffPoint(e.target.value)}
                        placeholder="VD: Trả tại bến xe, nội thành..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                        disabled={!isTripActive}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú thêm</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Yêu cầu đặc biệt..."
                      rows="2"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none disabled:bg-slate-100 disabled:text-slate-500"
                      disabled={!isTripActive}
                    ></textarea>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <h3 className="font-semibold text-slate-800 border-b pb-2">Thanh toán</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer flex-1 hover:bg-slate-50 transition-colors">
                      <input 
                        type="radio" 
                        name="paymentStatus" 
                        value="unpaid" 
                        checked={paymentStatus === 'unpaid'}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                        disabled={!isTripActive}
                      />
                      <span className="text-sm font-medium text-slate-700">Chưa thanh toán (Giữ chỗ)</span>
                    </label>
                    <label className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer flex-1 hover:bg-slate-50 transition-colors">
                      <input 
                        type="radio" 
                        name="paymentStatus" 
                        value="paid" 
                        checked={paymentStatus === 'paid'}
                        onChange={(e) => setPaymentStatus(e.target.value)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                        disabled={!isTripActive}
                      />
                      <span className="text-sm font-medium text-green-600">Đã thu tiền (Xuất vé)</span>
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="bg-white border-t border-slate-200 p-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">Tổng tiền thanh toán</span>
                <span className="text-2xl font-bold text-brand-600">
                  {totalPrice.toLocaleString('vi-VN')} ₫
                </span>
              </div>
              <button 
                form="pos-booking-form"
                type="submit"
                disabled={!isTripActive || isBooking || selectedSeats.length === 0}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transition-all
                  ${!isTripActive 
                    ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                    : selectedSeats.length === 0 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-brand-600 hover:bg-brand-700 hover:shadow-brand-500/30 hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {!isTripActive ? (
                  'CHUYẾN NÀY ĐÃ ĐÓNG ĐẶT VÉ'
                ) : isBooking ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </span>
                ) : 'XÁC NHẬN ĐẶT VÉ'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingModal;