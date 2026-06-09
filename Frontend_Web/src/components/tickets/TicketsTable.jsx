import StatusBadge from '../ui/StatusBadge';
import { EyeIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';

const TicketsTable = ({ data = [], currentPage, totalPages, onPageChange, onViewClick, onCancelClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="tickets-table-container">
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Mã vé</th>
            <th>Khách hàng</th>
            <th>Chuyến xe</th>
            <th>Vị trí ghế</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th style={{ width: '100px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                Không tìm thấy vé nào.
              </td>
            </tr>
          ) : (
            data.map((ticket) => (
              <tr key={ticket.id}>
                <td className="tickets-table__code">{ticket.id}</td>
                <td>
                  <div className="tickets-table__customer">
                    <span className="tickets-table__customer-name">{ticket.customerName}</span>
                    <span className="tickets-table__customer-phone">{ticket.customerPhone}</span>
                  </div>
                </td>
                <td>
                  <div className="tickets-table__trip">
                    <span className="tickets-table__trip-route">{ticket.route}</span>
                    <span className="tickets-table__trip-time">{ticket.departureTime} ({ticket.tripCode})</span>
                  </div>
                </td>
                <td className="tickets-table__seat">{ticket.seat}</td>
                <td className="tickets-table__price">{formatCurrency(ticket.price)}</td>
                <td>
                  <StatusBadge status={ticket.status} />
                </td>
                <td>
                  <div className="tickets-table__actions">
                    <button 
                      className="tickets-table__action-btn" 
                      title="Xem chi tiết"
                      onClick={() => onViewClick(ticket)}
                    >
                      <EyeIcon size={18} />
                    </button>
                    {ticket.status !== 'cancelled' && (
                      <button 
                        className="tickets-table__action-btn tickets-table__action-btn--delete" 
                        title="Hủy vé"
                        onClick={() => onCancelClick(ticket.id)}
                      >
                        <TrashIcon size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="tickets-pagination">
        <div className="tickets-pagination__info">
          Hiển thị {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, data.length > 0 ? (currentPage - 1) * 5 + data.length : 0)} trong tổng số vé
        </div>
        <div className="tickets-pagination__controls">
          <button 
            className="tickets-pagination__btn" 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeftIcon size={16} />
          </button>
          <span className="tickets-pagination__page">{currentPage}</span>
          <button 
            className="tickets-pagination__btn" 
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketsTable;
