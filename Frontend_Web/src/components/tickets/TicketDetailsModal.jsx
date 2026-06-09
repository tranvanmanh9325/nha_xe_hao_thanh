import { CloseIcon } from '../../assets/icons';
import StatusBadge from '../ui/StatusBadge';

const TicketDetailsModal = ({ isOpen, onClose, ticket }) => {
  if (!isOpen || !ticket) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
              <div className="ticket-detail-value ticket-seat-badge">{ticket.seat}</div>
            </div>

            <div className="ticket-detail-group">
              <label>Ngày đặt vé</label>
              <div className="ticket-detail-value">{ticket.bookingDate}</div>
            </div>

            <div className="ticket-detail-group">
              <label>Trạng thái</label>
              <div className="ticket-detail-value">
                <StatusBadge status={ticket.status} />
              </div>
            </div>

            <div className="ticket-detail-group">
              <label>Tổng thanh toán</label>
              <div className="ticket-detail-value ticket-price-highlight">
                {formatCurrency(ticket.price)}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
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
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsModal;
