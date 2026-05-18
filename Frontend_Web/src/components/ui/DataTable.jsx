import StatusBadge from './StatusBadge';
import { CalendarIcon, ClockIcon } from '../../assets/icons';
import '../../styles/data-table.css';

/**
 * Determine capacity bar color variant based on fill percentage.
 */
const getCapacityVariant = (booked, total) => {
  const ratio = booked / total;
  if (ratio >= 0.9) return 'high';
  if (ratio >= 0.6) return 'mid';
  return 'low';
};

/**
 * Data table component for displaying upcoming trips.
 *
 * @param {Array} trips - Array of trip objects
 * @param {string} title - Table section title
 */
const DataTable = ({ trips = [], title = 'Chuyến xe sắp khởi hành' }) => {
  return (
    <div className="data-table-wrapper">
      {/* Header */}
      <div className="data-table-header">
        <div>
          <span className="data-table-header__title">{title}</span>
          <span className="data-table-header__subtitle">{trips.length} chuyến</span>
        </div>
        <div className="data-table-header__actions">
          <button className="data-table-header__btn" type="button">
            <CalendarIcon size={16} />
            Hôm nay
          </button>
          <button className="data-table-header__btn" type="button">
            Xem tất cả
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã chuyến</th>
            <th>Tuyến đường</th>
            <th>Giờ khởi hành</th>
            <th>Ghế</th>
            <th>Trạng thái</th>
            <th>Tài xế</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              {/* Trip code */}
              <td className="data-table__cell--mono">{trip.code}</td>

              {/* Route */}
              <td>
                <div className="data-table__route">
                  <span className="data-table__cell--primary">{trip.from}</span>
                  <span className="data-table__route-arrow">→</span>
                  <span className="data-table__cell--primary">{trip.to}</span>
                </div>
              </td>

              {/* Departure time */}
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ClockIcon size={14} />
                  {trip.departure}
                </div>
              </td>

              {/* Seat capacity */}
              <td>
                <div className="data-table__capacity">
                  <div className="data-table__capacity-bar">
                    <div
                      className={`data-table__capacity-fill data-table__capacity-fill--${getCapacityVariant(trip.booked, trip.totalSeats)}`}
                      style={{ width: `${(trip.booked / trip.totalSeats) * 100}%` }}
                    />
                  </div>
                  <span className="data-table__capacity-text">
                    {trip.booked}/{trip.totalSeats}
                  </span>
                </div>
              </td>

              {/* Status */}
              <td>
                <StatusBadge status={trip.status} />
              </td>

              {/* Driver */}
              <td>{trip.driver}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
