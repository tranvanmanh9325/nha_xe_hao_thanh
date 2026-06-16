import { useState, useEffect, useMemo } from 'react';
import { CloseIcon } from '../../assets/icons';
import StatusBadge from '../ui/StatusBadge';
import Select from '../ui/Select';
import { authFetch, API_BASE_URL } from '../../utils/authService';
import { toast } from 'react-toastify';
import SeatMapRenderer from '../seat-map/SeatMapRenderer';
import { seatMapConfigs } from '../../data/seatMapConfig';

const TicketDetailsModal = ({ isOpen, onClose, ticket, onUpdateSuccess }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editSeat, setEditSeat] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // SeatMap States
  const [tripSeatMap, setTripSeatMap] = useState(null);
  const [loadingMap, setLoadingMap] = useState(false);
  const [mapError, setMapError] = useState(null);

  useEffect(() => {
    if (!isOpen || !ticket) {
      return;
    }

    const fetchSeatMap = async () => {
      setLoadingMap(true);
      setMapError(null);
      try {
        const response = await authFetch(`${API_BASE_URL}/api/v1/trips/${ticket.tripCode}/seats`);
        if (!response.ok) {
          throw new Error('Không tìm thấy sơ đồ ghế cho chuyến đi này');
        }
        const data = await response.json();
        setTripSeatMap(data);
      } catch (err) {
        setMapError(err.message);
      } finally {
        setLoadingMap(false);
      }
    };
    
    fetchSeatMap();
  }, [isOpen, ticket]);

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

  const currentBookedSeats = useMemo(() => {
    if (!tripSeatMap?.bookedSeats) return [];
    // Không tính ghế của vé hiện tại vào list ghế đã bán (để render nổi bật trên map)
    return tripSeatMap.bookedSeats.filter(s => s !== ticket.seat);
  }, [tripSeatMap, ticket]);

  const handleSeatSelect = (seatId) => {
    if (!isEditMode) return;
    if (currentBookedSeats.includes(seatId)) {
      toast.warning('Ghế này đã có người đặt!');
      return;
    }
    setEditSeat(seatId);
  };

  const handleEditClick = () => {
    setEditStatus(ticket.status || 'pending');
    setEditSeat(ticket.seat || '');
    setIsEditMode(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleUpdate = async () => {
    if (!editSeat.trim()) {
      toast.error('Vui lòng chọn vị trí ghế');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/tickets/${ticket.originalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          paymentStatus: editStatus,
          newSeatCode: editSeat
        })
      });

      if (response.ok) {
        toast.success('Cập nhật vé thành công!');
        setIsEditMode(false);
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
      } else {
        const errorData = await response.json();
        toast.error(`Lỗi: ${errorData.error || 'Không thể cập nhật vé'}`);
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error("Lỗi kết nối đến server");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-hidden" onClick={onClose}>
      <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Chi tiết vé: <span className="text-brand-600">{ticket.id}</span></h2>
            <p className="text-sm text-slate-500 mt-1">Chuyến: {ticket.route} | Khởi hành: {ticket.departureTime}</p>
          </div>
          <button 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors" 
            onClick={onClose}
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Content Split */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Column: Seat Map (60%) */}
          <div className="w-[60%] flex flex-col bg-slate-50 border-r border-slate-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-semibold text-slate-800">Sơ đồ ghế chuyến {ticket.tripCode}</h3>
                  <p className="text-sm text-slate-500">
                    {isEditMode ? 'Click vào ghế trống để đổi vị trí' : 'Sơ đồ chỉ xem, nhấn Chỉnh sửa để đổi ghế'}
                  </p>
                </div>
                <div className="flex gap-4 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white border-2 border-slate-300"></div>
                    <span className="text-slate-600">Trống</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-brand-500 border-2 border-brand-600 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                    <span className="text-slate-600">{isEditMode ? 'Đang chọn' : 'Ghế của vé'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-slate-200 border-2 border-slate-300 opacity-60"></div>
                    <span className="text-slate-600">Đã bán</span>
                  </div>
                </div>
              </div>

              {loadingMap ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                  <span className="ml-3 text-slate-500">Đang tải sơ đồ ghế...</span>
                </div>
              ) : mapError ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center border border-red-100">
                  {mapError}
                </div>
              ) : currentConfig ? (
                <div className={`flex justify-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[400px] transition-opacity ${!isEditMode ? 'opacity-80' : ''}`}>
                  <div className="transform scale-90 origin-top">
                    <SeatMapRenderer
                      config={currentConfig}
                      selectedSeats={[isEditMode ? editSeat : ticket.seat]}
                      onSeatSelect={handleSeatSelect}
                      bookedSeats={currentBookedSeats}
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

          {/* Right Column: Ticket Info & Form (40%) */}
          <div className="w-[40%] flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-300">
              
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-slate-500 mb-1">Khách hàng</span>
                    <span className="font-medium text-slate-800">{ticket.customerName}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Số điện thoại</span>
                    <span className="font-medium text-slate-800">{ticket.customerPhone}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Ngày đặt vé</span>
                    <span className="font-medium text-slate-800">{ticket.bookingDate}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500 mb-1">Tổng thanh toán</span>
                    <span className="font-bold text-brand-600">{formatCurrency(ticket.price)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Chỉnh sửa thông tin</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Vị trí ghế</label>
                    <input 
                      type="text" 
                      value={isEditMode ? editSeat : ticket.seat} 
                      readOnly
                      className={`w-full px-3 py-2.5 border rounded-lg outline-none font-semibold text-center text-lg
                        ${isEditMode ? 'border-brand-300 bg-brand-50 text-brand-700 ring-2 ring-brand-100' : 'border-slate-200 bg-slate-50 text-slate-600'}`}
                    />
                    {isEditMode && <p className="text-xs text-slate-500 mt-1 text-center">Click vào sơ đồ bên trái để đổi ghế</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái thanh toán</label>
                    {isEditMode ? (
                      <Select 
                        value={editStatus} 
                        onChange={setEditStatus}
                        options={[
                          { value: 'pending', label: 'Chờ thanh toán' },
                          { value: 'paid', label: 'Đã thanh toán' },
                          { value: 'cancelled', label: 'Đã hủy' }
                        ]}
                        style={{ width: '100%', height: '42px' }}
                      />
                    ) : (
                      <div className="pt-1">
                        <StatusBadge status={ticket.status} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="bg-white border-t border-slate-200 p-6 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sticky bottom-0 z-10">
              {isEditMode ? (
                <>
                  <button 
                    className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors" 
                    onClick={() => {
                      setIsEditMode(false);
                      setEditSeat(ticket.seat); // Reset
                    }} 
                    disabled={isUpdating}
                  >
                    Hủy
                  </button>
                  <button 
                    className="px-6 py-2.5 rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md transition-all flex items-center gap-2" 
                    onClick={handleUpdate} 
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors" 
                    onClick={onClose}
                  >
                    Đóng
                  </button>
                  {ticket.status !== 'cancelled' && (
                    <button 
                      className="px-6 py-2.5 rounded-lg font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors" 
                      onClick={handleEditClick}
                    >
                      Chỉnh sửa
                    </button>
                  )}
                  {ticket.status !== 'cancelled' && (
                    <button 
                      className="px-6 py-2.5 rounded-lg font-medium text-white bg-slate-800 hover:bg-slate-900 shadow-md transition-colors" 
                      onClick={() => alert('Chức năng in vé đang được cập nhật!')}
                    >
                      In vé
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;

