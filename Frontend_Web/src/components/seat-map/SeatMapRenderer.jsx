
import Seat from './Seat';
import './SeatMap.css';

/**
 * Renders the full vehicle layout based on the provided configuration.
 *
 * @param {Object} props
 * @param {Object} props.config - Vehicle layout schema
 * @param {Array<string>} props.selectedSeats - Array of selected seat IDs
 * @param {Array<string>} [props.bookedSeats] - Array of booked seat IDs
 */
const SeatMapRenderer = ({ config, selectedSeats, onSeatSelect, bookedSeats = [] }) => {
  if (!config || !config.floors) {
    return <div>No configuration available</div>;
  }

  // A simple SVG steering wheel icon
  const SteeringWheel = () => (
    <div className="seatmap-steering-wheel">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="2" x2="12" y2="10" />
        <line x1="2.68" y1="16" x2="10.27" y2="13" />
        <line x1="21.32" y1="16" x2="13.73" y2="13" />
      </svg>
    </div>
  );

  return (
    <div className="seatmap-vehicle-wrapper">
      {config.floors.map((floor) => (
        <div key={floor.floorIndex} className="seatmap-floor">
          <h3 className="seatmap-floor-title">{floor.floorName}</h3>
          
          {/* Steering wheel is typically on the 1st floor at the front */}
          {floor.floorIndex === 1 && <SteeringWheel />}

          <div className="seatmap-matrix">
            {floor.matrix.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="seatmap-row">
                {row.map((cell, colIndex) => {
                  const isSeat = cell && cell.type === 'seat';
                  const cellData = isSeat 
                    ? { ...cell, status: bookedSeats.includes(cell.id) ? 'booked' : cell.status } 
                    : cell;
                  
                  return (
                    <div key={`cell-${rowIndex}-${colIndex}`} className="seatmap-cell">
                      {isSeat ? (
                        <Seat
                          data={cellData}
                          isSelected={selectedSeats.includes(cell.id)}
                          onSelect={onSeatSelect}
                        />
                      ) : (
                        // Render empty space for aisles
                        <div className="seatmap-cell empty" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeatMapRenderer;
