import '../../styles/status-badge.css';

/* Status label mapping — Vietnamese display names */
const STATUS_CONFIG = {
  upcoming: 'Sắp chạy',
  available: 'Còn trống',
  full: 'Đã đầy',
  running: 'Đang chạy',
  completed: 'Hoàn thành',
  cancelled: 'Hủy',
  paid: 'Đã thanh toán',
  unpaid: 'Chưa thanh toán',
};

const STATUS_STYLES = {
  upcoming: { bg: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  running: { bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  completed: { bg: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
  cancelled: { bg: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
  available: { bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  full: { bg: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
  paid: { bg: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  unpaid: { bg: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
  default: { bg: 'bg-gray-50 text-gray-700', dot: 'bg-gray-400' }
};

const normalizeStatus = (status) => {
  if (!status) return 'upcoming';
  const s = String(status).toLowerCase();
  if (s === 'scheduled') return 'upcoming';
  if (s === 'in_progress' || s === 'active') return 'running';
  if (s === 'canceled') return 'cancelled';
  if (s === 'pending') return 'unpaid';
  return s;
};

/**
 * Pill-shaped badge indicating trip status.
 *
 * @param {'available'|'full'|'running'|'completed'|'upcoming'|'cancelled'} status
 */
const StatusBadge = ({ status }) => {
  const normalizedStatus = normalizeStatus(status);
  const label = STATUS_CONFIG[normalizedStatus] || status;
  const style = STATUS_STYLES[normalizedStatus] || STATUS_STYLES.default;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${style.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
};

export default StatusBadge;