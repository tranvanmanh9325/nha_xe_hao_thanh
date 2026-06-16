import { useState } from 'react';
import { CloseIcon } from '../../assets/icons';
import StatusBadge from '../ui/StatusBadge';
import { authFetch } from '../../utils/authService';
import { toast } from 'react-toastify';

const TicketDetailsModal = ({ isOpen, onClose, ticket, onUpdateSuccess }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [editSeat, setEditSeat] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !ticket) return null;

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
      toast.error('Vui lòng nhập vị trí ghế');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await authFetch(`http://localhost:8080/api/v1/tickets/${ticket.originalId}`, {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content ticket-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Chi tiết vé {ticket.id}</h2>
          <button className="modal-close" onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="ticket-details-grid">
            <div className="ticket-detail-group">
              <label>Khách hàng</label>
              <div className="ticket-detail-value">{ticket.customerName}</div>
            </div>
            
            <div className="ticket-detail-group">
              <label>Số điện thoại</label>
              <div className="ticket-detail-value">{ticket.customerPhone}</div>
            </div>

            <div className="ticket-detail-group">
              <label>Chuyến xe</label>
              <div className="ticket-detail-value">{ticket.route}</div>
            </div>

            <div className="ticket-detail-group">
              <label>Mã chuyến / Khởi hành</label>
              <div className="ticket-detail-value">{ticket.tripCode} | {ticket.departureTime}</div>
            </div>

            <div className="ticket-detail-group">
              <label>Vị trí ghế</label>
              {isEditMode ? (
                <input 
                  type="text" 
                  value={editSeat} 
                  onChange={(e) => setEditSeat(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                />
              ) : (
                <div className="ticket-detail-value ticket-seat-badge">{ticket.seat}</div>
              )}
            </div>

            <div className="ticket-detail-group">
              <label>Ngày đặt vé</label>
              <div className="ticket-detail-value">{ticket.bookingDate}</div>
            </div>

            <div className="ticket-detail-group">
              <label>Trạng thái</label>
              {isEditMode ? (
                <select 
                  value={editStatus} 
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ width: '100%', padding: '8px', border: '1px solid #D1D5DB', borderRadius: '4px' }}
                >
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              ) : (
                <div className="ticket-detail-value">
                  <StatusBadge status={ticket.status} />
                </div>
              )}
            </div>

            <div className="ticket-detail-group">
              <label>Tổng thanh toán</label>
              <div className="ticket-detail-value ticket-price-highlight">
                {formatCurrency(ticket.price)}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <div>
            {!isEditMode && ticket.status !== 'cancelled' && (
               <button className="btn btn--outline" onClick={handleEditClick} style={{ color: 'var(--brand-600)', borderColor: 'var(--brand-600)' }}>
                 Chỉnh sửa
               </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isEditMode ? (
              <>
                <button className="btn btn--outline" onClick={() => setIsEditMode(false)} disabled={isUpdating}>
                  Hủy
                </button>
                <button className="btn btn--primary" onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn--outline" onClick={onClose}>
                  Đóng
                </button>
                {ticket.status !== 'cancelled' && (
                  <button className="btn btn--primary" style={{ backgroundColor: 'var(--brand-500)' }} onClick={() => {
                      alert('Chức năng in vé đang được cập nhật!');
                  }}>
                    In vé
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
