
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

  // A simple SVG steering wheel icon and door
  const FrontRow = () => (
    <div className="seatmap-front-row">
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
      <div className="seatmap-door">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18"></path>
          <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path>
          <path d="M14 12h2"></path>
        </svg>
        <span className="door-label">Cửa</span>
      </div>
    </div>
  );

  return (
    <div className="seatmap-vehicle-wrapper">
      {config.floors.map((floor) => (
        <div key={floor.floorIndex} className="seatmap-floor">
          <h3 className="seatmap-floor-title">{floor.floorName}</h3>
          
          {/* Front row is typically on the 1st floor at the front */}
          {floor.floorIndex === 1 && <FrontRow />}

          <div className="seatmap-matrix" style={floor.floorIndex === 2 ? { marginTop: '76px' } : {}}>
            {floor.matrix.map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="seatmap-row">
                {row.map((cell, colIndex) => {
                  const isSeat = cell && cell.type === 'seat';
                  const isWc = cell && cell.type === 'wc';
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
                      ) : isWc ? (
                        <div className="seat" style={{ 
                          width: '100%', 
                          maxWidth: '54px', 
                          height: '64px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          backgroundColor: 'var(--warning-100, #ffedd5)',
                          border: '2px solid var(--warning-500, #f97316)',
                          borderRadius: '8px',
                          color: 'var(--warning-700, #c2410c)',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                          cursor: 'default'
                        }}>
                          WC
                        </div>
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
