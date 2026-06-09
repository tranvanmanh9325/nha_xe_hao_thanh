import '../../styles/status-badge.css';

/* Status label mapping — Vietnamese display names */
const STATUS_CONFIG = {
  upcoming: 'Sắp chạy',
  available: 'Còn trống',
  full: 'Đã đầy',
  running: 'Đang chạy',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  paid: 'Đã thanh toán',
  unpaid: 'Chưa thanh toán',
};

/**
 * Pill-shaped badge indicating trip status.
 *
 * @param {'available'|'full'|'running'|'completed'} status
 */
const StatusBadge = ({ status }) => {
  const label = STATUS_CONFIG[status] || status;

  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge__dot" />
      {label}
    </span>
  );
};

export default StatusBadge;
