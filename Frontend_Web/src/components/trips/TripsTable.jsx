import StatusBadge from '../ui/StatusBadge';
import { EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';

const TripsTable = ({ data = [], currentPage, totalPages, onPageChange }) => {
  return (
    <div className="trips-table-container">
      <table className="trips-table">
        <thead>
          <tr>
            <th>Mã chuyến</th>
            <th>Tuyến đường</th>
            <th>Khởi hành</th>
            <th>Loại xe</th>
            <th>Tài xế</th>
            <th>Trạng thái</th>
            <th style={{ width: '80px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                Không tìm thấy chuyến xe nào.
              </td>
            </tr>
          ) : (
            data.map((trip) => (
              <tr key={trip.id}>
                <td className="trips-table__code">{trip.code}</td>
                <td>{trip.route}</td>
                <td>{trip.departure}</td>
                <td>{trip.vehicleType}</td>
                <td>{trip.driver}</td>
                <td>
                  <StatusBadge status={trip.status} />
                </td>
                <td>
                  <div className="trips-table__actions">
                    <button className="trips-table__action-btn" title="Chỉnh sửa">
                      <EditIcon size={18} />
                    </button>
                    <button className="trips-table__action-btn trips-table__action-btn--delete" title="Xóa">
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="trips-pagination">
        <div className="trips-pagination__info">
          Hiển thị {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, currentPage * 10 /* mock total */)} trong tổng số nhiều chuyến
        </div>
        <div className="trips-pagination__controls">
          <button 
            className="trips-pagination__btn" 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeftIcon size={16} />
          </button>
          <span className="trips-pagination__page">{currentPage}</span>
          <button 
            className="trips-pagination__btn" 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripsTable;
