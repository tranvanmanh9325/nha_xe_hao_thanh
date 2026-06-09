
import './SeatMap.css';

/**
 * Seat component renders a single seat (available, booked, or selected).
 *
 * @param {Object} props
 * @param {Object} props.data - Seat data {id, status, type}
 * @param {boolean} props.isSelected - Whether the seat is currently selected
 * @param {Function} props.onSelect - Callback when seat is clicked
 */
const Seat = ({ data, isSelected, onSelect }) => {
  if (!data) return <div className="seatmap-cell empty" />;

  const { id, status } = data;
  
  // Determine state class
  let stateClass = 'available';
  if (status === 'booked') {
    stateClass = 'booked';
  } else if (isSelected) {
    stateClass = 'selected';
  }

  const handleClick = () => {
    if (status !== 'booked') {
      onSelect(id);
    }
  };

  return (
    <button
      type="button"
      className={`seat ${stateClass}`}
      onClick={handleClick}
      disabled={status === 'booked'}
      aria-label={`Seat ${id}, ${stateClass}`}
    >
      <span className="seat-label">{id}</span>
      <svg
        className="seat-svg"
        viewBox="0 0 40 50"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main Seat Body */}
        <rect
          className="seat-bg"
          x="4"
          y="6"
          width="32"
          height="38"
          rx="6"
        />
        {/* Headrest */}
        <path
          className="seat-bg"
          d="M10 2 Q 20 -2, 30 2 L 32 8 L 8 8 Z"
          strokeLinejoin="round"
        />
        {/* Inner Cushion */}
        <rect
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.2"
          x="10"
          y="12"
          width="20"
          height="28"
          rx="4"
        />
      </svg>
    </button>
  );
};

export default Seat;
