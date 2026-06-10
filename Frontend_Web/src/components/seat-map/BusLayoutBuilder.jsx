import { useState, forwardRef, useImperativeHandle } from 'react';
import { toast } from 'react-toastify';
import './SeatMap.css'; // Reusing some base styles

const CELL_TYPES = {
  SEAT: { type: 'seat', label: 'Ghế', color: 'var(--primary-100)', border: 'var(--primary-500)' },
  EMPTY: { type: 'empty', label: 'Lối đi', color: 'transparent', border: 'var(--neutral-300)' },
  WC: { type: 'wc', label: 'WC', color: 'var(--warning-100)', border: 'var(--warning-500)' },
  EDIT: { type: 'edit', label: 'Sửa mã ghế', color: 'var(--success-100)', border: 'var(--success-500)' },
};

const SeatIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--primary-600, #2563eb)">
    <rect x="6" y="2" width="12" height="6" rx="2" opacity="0.85" />
    <rect x="5" y="9" width="14" height="11" rx="2" opacity="1" />
    <rect x="2" y="10" width="3" height="8" rx="1" opacity="0.7" />
    <rect x="19" y="10" width="3" height="8" rx="1" opacity="0.7" />
  </svg>
);

const generateInitialMatrix = (floorIndex, rows, cols) => {
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      // floor 1 starts from A, floor 2 starts from D (assume standard 3 cols for floor 1)
      const startCharCode = floorIndex === 1 ? 65 : 68; 
      const char = String.fromCharCode(startCharCode + c);
      row.push({ id: `${char}-${r + 1}`, type: 'seat', status: 'available' });
    }
    matrix.push(row);
  }
  return matrix;
};

const BusLayoutBuilder = forwardRef(({ busId, busInfo, existingConfig, onSaveSuccess, onSavingChange }, ref) => {
  const [name] = useState(existingConfig?.name || 'Custom Layout');
  const [basePrice, setBasePrice] = useState(existingConfig?.basePrice || 250000);
  const [numFloors, setNumFloors] = useState(existingConfig?.floors?.length || 1);
  const [rows, setRows] = useState(existingConfig?.floors?.[0]?.matrix?.length || 6);
  const [cols, setCols] = useState(existingConfig?.floors?.[0]?.matrix?.[0]?.length || 5);
  const [selectedType, setSelectedType] = useState('seat');
  const [editingCell, setEditingCell] = useState(null);

  const [floorsData, setFloorsData] = useState(() => {
    if (existingConfig && existingConfig.floors) {
      return existingConfig.floors.map(floor => ({
        floorIndex: floor.floorIndex,
        floorName: floor.floorName,
        matrix: floor.matrix.map((row, rIdx) => 
          row.map((cell, cIdx) => {
            if (!cell) return { id: `R${rIdx}C${cIdx}`, type: 'empty' };
            return cell;
          })
        )
      }));
    }
    // Generate initial grid if no existing config
    const newFloors = [];
    for (let i = 1; i <= 1; i++) {
      newFloors.push({
        floorIndex: i,
        floorName: `Tầng ${i}`,
        matrix: generateInitialMatrix(i, 6, 5)
      });
    }
    return newFloors;
  });

  const currentSeatCount = floorsData.reduce((total, floor) => {
    return total + floor.matrix.reduce((rowCount, row) => {
      return rowCount + row.filter(cell => cell.type === 'seat').length;
    }, 0);
  }, 0);

  const handleGenerateGrid = () => {
    const newFloors = [];
    for (let i = 1; i <= numFloors; i++) {
      newFloors.push({
        floorIndex: i,
        floorName: `Tầng ${i}`,
        matrix: generateInitialMatrix(i, rows, cols)
      });
    }
    setFloorsData(newFloors);
  };

  const handleCellClick = (floorIndex, rIndex, cIndex) => {
    if (selectedType === 'edit') {
      const floor = floorsData.find(f => f.floorIndex === floorIndex);
      if (floor) {
        const cell = floor.matrix[rIndex][cIndex];
        if (cell.type === 'seat') {
          const isDefaultId = cell.id.startsWith('S_') || cell.id.match(/^R\d+C\d+$/);
          setEditingCell({ floorIndex, rIndex, cIndex, tempId: isDefaultId ? '' : cell.id });
        } else {
          toast.info('Chỉ có thể sửa mã cho các ô là Ghế');
        }
      }
      return;
    }

    setFloorsData(prev => {
      const newFloors = [...prev];
      const floor = newFloors.find(f => f.floorIndex === floorIndex);
      if (floor) {
        const cell = floor.matrix[rIndex][cIndex];
        const currentType = cell.type;
        const nextType = currentType === selectedType && selectedType !== 'empty' ? 'empty' : selectedType;
        
        let newId = cell.id;
        // Generate a new ID if it becomes a seat
        if (nextType === 'seat' && (!newId || newId.startsWith('S_') || newId.match(/^R\d+C\d+$/))) {
           const startCharCode = floorIndex === 1 ? 65 : 68;
           const char = String.fromCharCode(startCharCode + cIndex);
           newId = `${char}-${rIndex + 1}`;
        }

        floor.matrix[rIndex][cIndex] = {
          ...cell,
          id: newId,
          type: nextType,
          status: nextType === 'seat' ? 'available' : undefined
        };
      }
      return newFloors;
    });
  };

  const saveCellId = () => {
    if (editingCell) {
      const newId = editingCell.tempId.trim();
      
      setFloorsData(prev => {
        const newFloors = [...prev];
        const floor = newFloors.find(f => f.floorIndex === editingCell.floorIndex);
        if (floor) {
          const cell = floor.matrix[editingCell.rIndex][editingCell.cIndex];
          
          // Basic validation: Check if ID already exists on any floor
          let isDuplicate = false;
          if (newId) {
            for (const f of newFloors) {
              for (const row of f.matrix) {
                for (const c of row) {
                  if (c.id === newId && !(f.floorIndex === editingCell.floorIndex && c === cell)) {
                    isDuplicate = true;
                  }
                }
              }
            }
          }

          if (isDuplicate) {
            toast.error(`Mã ghế "${newId}" đã tồn tại!`);
            return prev; // abort save
          }

          floor.matrix[editingCell.rIndex][editingCell.cIndex] = {
            ...cell,
            id: newId || `S_${editingCell.floorIndex}_${editingCell.rIndex}_${editingCell.cIndex}` // fallback
          };
        }
        return newFloors;
      });
      setEditingCell(null);
    }
  };

  const handleSave = async () => {
    if (onSavingChange) onSavingChange(true);

    if (busInfo) {
      const currentCount = floorsData.reduce((total, floor) => {
        return total + floor.matrix.reduce((rowCount, row) => {
          return rowCount + row.filter(cell => cell.type === 'seat').length;
        }, 0);
      }, 0);

      if (currentCount > Number(busInfo.totalSeats)) {
        toast.error(`Không thể lưu: Số ghế trên sơ đồ (${currentCount}) vượt quá tổng số ghế của xe (${busInfo.totalSeats})`);
        if (onSavingChange) onSavingChange(false);
        return;
      }

      if (currentCount < Number(busInfo.totalSeats)) {
        toast.error(`Không thể lưu: Chưa xếp đủ số ghế. Còn thiếu ${Number(busInfo.totalSeats) - currentCount} ghế.`);
        if (onSavingChange) onSavingChange(false);
        return;
      }
    }

    try {
      // Transform back: empty cells to null
      const savedFloors = floorsData.map(floor => ({
        floorIndex: floor.floorIndex,
        floorName: floor.floorName,
        matrix: floor.matrix.map(row => 
          row.map(cell => {
            if (cell.type === 'empty') return null;
            // Clean up unnecessary fields
            return {
              id: cell.id,
              type: cell.type,
              status: cell.status
            };
          })
        )
      }));

      const payload = {
        id: 'custom_' + Date.now(),
        name,
        basePrice,
        floors: savedFloors
      };

      const response = await fetch(`http://localhost:8080/api/v1/buses/${busId}/layout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ layoutConfig: JSON.stringify(payload) })
      });

      if (!response.ok) throw new Error('Lỗi khi lưu sơ đồ');
      
      const data = await response.json();
      toast.success('Đã lưu sơ đồ thành công!');
      if (onSaveSuccess) onSaveSuccess(data);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      if (onSavingChange) onSavingChange(false);
    }
  };

  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

  return (
    <div style={{ padding: '0 var(--space-4)' }}>
      {/* TOOLBAR */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 'var(--space-6)',
        backgroundColor: 'var(--neutral-50)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--neutral-200)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neutral-600)', whiteSpace: 'nowrap' }}>Ghế đã xếp:</label>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: 'bold', 
              color: busInfo && currentSeatCount > Number(busInfo.totalSeats) ? 'var(--danger-500, red)' : 'var(--primary-600)' 
            }}>
              {currentSeatCount} / {busInfo ? busInfo.totalSeats : 0}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neutral-600)', whiteSpace: 'nowrap' }}>Giá (VND):</label>
            <input type="number" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} style={{ padding: '6px 10px', border: '1px solid var(--neutral-300)', borderRadius: '4px', fontSize: '13px', width: '100px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neutral-600)', whiteSpace: 'nowrap' }}>Tầng:</label>
            <select 
              value={numFloors} 
              onChange={e => setNumFloors(Number(e.target.value))} 
              style={{ 
                padding: '6px 28px 6px 12px', 
                border: '1px solid var(--neutral-300)', 
                borderRadius: '4px', 
                fontSize: '13px',
                appearance: 'none',
                backgroundColor: 'var(--white, #ffffff)',
                backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '60px',
                color: 'var(--neutral-800)',
                transition: 'border-color 0.2s'
              }}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neutral-600)', whiteSpace: 'nowrap' }}>Hàng:</label>
            <input type="number" min={1} max={20} value={rows} onChange={e => setRows(Number(e.target.value))} style={{ width: '60px', padding: '6px 10px', border: '1px solid var(--neutral-300)', borderRadius: '4px', fontSize: '13px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'var(--neutral-600)', whiteSpace: 'nowrap' }}>Cột:</label>
            <input type="number" min={1} max={10} value={cols} onChange={e => setCols(Number(e.target.value))} style={{ width: '60px', padding: '6px 10px', border: '1px solid var(--neutral-300)', borderRadius: '4px', fontSize: '13px' }} />
          </div>
          <button className="btn" style={{ padding: '6px 12px', fontSize: '13px', backgroundColor: 'var(--neutral-200)', color: 'var(--neutral-700)', border: '1px solid var(--neutral-300)' }} onClick={handleGenerateGrid}>Áp dụng</button>
        </div>
      </div>

      {/* LEGEND */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '24px', justifyContent: 'center' }}>
        {Object.values(CELL_TYPES).map(t => {
          const isSelected = selectedType === t.type;
          return (
            <div 
              key={t.type} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedType(t.type)}
            >
              <div 
                style={{
                  width: '32px',
                  height: '40px',
                  borderRadius: '6px',
                  backgroundColor: t.type === 'empty' ? 'transparent' : t.color,
                  border: isSelected 
                    ? '2px solid var(--warning-500, #f97316)' 
                    : (t.type === 'empty' ? '1px dashed var(--neutral-400)' : `1px solid ${t.border}`),
                  boxShadow: isSelected ? 'inset 0 2px 4px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isSelected ? 'translateY(2px)' : 'none',
                  fontSize: '14px'
                }}
              >
                {t.type === 'seat' ? <SeatIcon size={18} /> : t.type === 'wc' ? 'WC' : t.type === 'edit' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                ) : ''}
              </div>
              <span style={{
                fontSize: '14px',
                color: 'var(--neutral-700)',
                fontWeight: isSelected ? '600' : '500'
              }}>
                {t.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* MATRIX */}
      <div className="seatmap-vehicle-wrapper">
        {floorsData.map((floor) => (
          <div key={floor.floorIndex} className="seatmap-floor">
            <h3 className="seatmap-floor-title">{floor.floorName}</h3>
            
            {floor.floorIndex === 1 && (
              <div className="seatmap-front-row">
                <div className="seatmap-steering-wheel">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            )}

            <div className="seatmap-matrix" style={floor.floorIndex === 2 ? { marginTop: '76px' } : {}}>
              {floor.matrix.map((row, rIdx) => (
                <div key={`row-${rIdx}`} className="seatmap-row">
                  {row.map((cell, cIdx) => (
                    <div key={`cell-${rIdx}-${cIdx}`} className="seatmap-cell">
                      <div 
                        onClick={() => handleCellClick(floor.floorIndex, rIdx, cIdx)}
                        className={`seat`}
                        style={{ 
                          width: '100%', 
                          maxWidth: '54px', 
                          height: '64px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          cursor: 'pointer', 
                          borderRadius: '8px', 
                          border: cell.type !== 'empty' ? '2px solid' : '1px dashed var(--neutral-300)', 
                          borderColor: cell.type !== 'empty' ? (CELL_TYPES[cell.type.toUpperCase()]?.border || 'transparent') : 'var(--neutral-300)', 
                          backgroundColor: cell.type !== 'empty' ? (CELL_TYPES[cell.type.toUpperCase()]?.color || 'transparent') : 'transparent',
                          transition: 'all 0.2s ease',
                          fontSize: '18px'
                        }}
                        title={`Hàng ${rIdx + 1}, Cột ${cIdx + 1}`}
                      >
                        {cell.type === 'seat' ? (
                          editingCell?.floorIndex === floor.floorIndex && 
                          editingCell?.rIndex === rIdx && 
                          editingCell?.cIndex === cIdx ? (
                            <input 
                              type="text"
                              autoFocus
                              value={editingCell.tempId}
                              onChange={e => setEditingCell({...editingCell, tempId: e.target.value.toUpperCase()})}
                              onBlur={saveCellId}
                              onKeyDown={e => {
                                if (e.key === 'Enter') saveCellId();
                                if (e.key === 'Escape') setEditingCell(null);
                              }}
                              style={{ 
                                width: '90%', 
                                textAlign: 'center', 
                                fontSize: '14px', 
                                fontWeight: 'bold', 
                                padding: '4px 2px', 
                                borderRadius: '4px', 
                                border: '2px solid var(--primary-500)', 
                                outline: 'none',
                                color: 'var(--neutral-800)'
                              }}
                              onClick={e => e.stopPropagation()}
                            />
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                              <span style={{ 
                                fontSize: '13px', 
                                fontWeight: 'bold', 
                                color: 'var(--primary-700)', 
                                lineHeight: 1,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {cell.id.startsWith('S_') || cell.id.match(/^R\d+C\d+$/) ? '---' : cell.id}
                              </span>
                              <SeatIcon size={24} />
                            </div>
                          )
                        ) : cell.type === 'wc' ? 'WC' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default BusLayoutBuilder;
