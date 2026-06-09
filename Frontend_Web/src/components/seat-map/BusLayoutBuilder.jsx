import { useState } from 'react';
import './SeatMap.css'; // Reusing some base styles

const CELL_TYPES = {
  SEAT: { type: 'seat', label: 'Ghế', color: 'var(--primary-100)', border: 'var(--primary-500)' },
  EMPTY: { type: 'empty', label: 'Lối đi', color: 'transparent', border: 'var(--neutral-300)' },
  DRIVER: { type: 'driver', label: 'Tài xế', color: 'var(--neutral-200)', border: 'var(--neutral-500)' },
  WC: { type: 'wc', label: 'WC', color: 'var(--warning-100)', border: 'var(--warning-500)' },
};

const NEXT_TYPE = {
  'seat': 'empty',
  'empty': 'driver',
  'driver': 'wc',
  'wc': 'seat'
};

const generateInitialMatrix = (rows, cols) => {
  const matrix = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({ id: `R${r}C${c}`, type: 'seat', status: 'available' });
    }
    matrix.push(row);
  }
  return matrix;
};

const BusLayoutBuilder = ({ busId, existingConfig, onSaveSuccess, onCancel }) => {
  const [name, setName] = useState(existingConfig?.name || 'Custom Layout');
  const [basePrice, setBasePrice] = useState(existingConfig?.basePrice || 250000);
  const [numFloors, setNumFloors] = useState(existingConfig?.floors?.length || 1);
  const [rows, setRows] = useState(existingConfig?.floors?.[0]?.matrix?.length || 6);
  const [cols, setCols] = useState(existingConfig?.floors?.[0]?.matrix?.[0]?.length || 5);
  const [isSaving, setIsSaving] = useState(false);

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
        matrix: generateInitialMatrix(6, 5)
      });
    }
    return newFloors;
  });

  const handleGenerateGrid = () => {
    const newFloors = [];
    for (let i = 1; i <= numFloors; i++) {
      newFloors.push({
        floorIndex: i,
        floorName: `Tầng ${i}`,
        matrix: generateInitialMatrix(rows, cols)
      });
    }
    setFloorsData(newFloors);
  };

  const handleCellClick = (floorIndex, rIndex, cIndex) => {
    setFloorsData(prev => {
      const newFloors = [...prev];
      const floor = newFloors.find(f => f.floorIndex === floorIndex);
      if (floor) {
        const cell = floor.matrix[rIndex][cIndex];
        const currentType = cell.type;
        const nextType = NEXT_TYPE[currentType] || 'seat';
        
        let newId = cell.id;
        // Generate a new ID if it becomes a seat, but keep simple for now
        if (nextType === 'seat' && !newId.match(/^[A-Z][0-9]+/)) {
           newId = `S_${floorIndex}_${rIndex}_${cIndex}`;
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

  const handleSave = async () => {
    setIsSaving(true);
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
      alert('Đã lưu sơ đồ thành công!');
      if (onSaveSuccess) onSaveSuccess(data);
      
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'white', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3 style={{ margin: 0, color: 'var(--primary-600)' }}>Trình thiết kế Sơ đồ xe</h3>
        <button className="btn" style={{ backgroundColor: 'var(--neutral-300)', color: 'var(--neutral-800)' }} onClick={onCancel}>Đóng</button>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Tên cấu hình</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ padding: '8px', border: '1px solid var(--neutral-300)', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Giá vé cơ bản (VND)</label>
          <input type="number" value={basePrice} onChange={e => setBasePrice(Number(e.target.value))} style={{ padding: '8px', border: '1px solid var(--neutral-300)', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Số Tầng</label>
          <select value={numFloors} onChange={e => setNumFloors(Number(e.target.value))} style={{ padding: '8px', border: '1px solid var(--neutral-300)', borderRadius: '4px' }}>
            <option value={1}>1 Tầng</option>
            <option value={2}>2 Tầng</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Số Hàng</label>
          <input type="number" min={1} max={20} value={rows} onChange={e => setRows(Number(e.target.value))} style={{ width: '60px', padding: '8px', border: '1px solid var(--neutral-300)', borderRadius: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>Số Cột</label>
          <input type="number" min={1} max={10} value={cols} onChange={e => setCols(Number(e.target.value))} style={{ width: '60px', padding: '8px', border: '1px solid var(--neutral-300)', borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleGenerateGrid}>Tạo lưới mới</button>
        </div>
      </div>

      <div style={{ marginBottom: 'var(--space-4)', fontSize: '14px', display: 'flex', gap: '16px' }}>
        <span><strong>Chú giải (Click vào ô để đổi):</strong></span>
        {Object.values(CELL_TYPES).map(t => (
          <span key={t.type} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '16px', height: '16px', backgroundColor: t.color, border: `1px solid ${t.border}`, borderRadius: '4px' }}></div>
            {t.label}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-8)', overflowX: 'auto', paddingBottom: 'var(--space-4)' }}>
        {floorsData.map((floor) => (
          <div key={floor.floorIndex} style={{ minWidth: 'fit-content' }}>
            <h4 style={{ textAlign: 'center', color: 'var(--neutral-600)', marginBottom: 'var(--space-4)' }}>{floor.floorName}</h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${cols}, 40px)`,
              gap: '12px',
              backgroundColor: 'var(--neutral-50)',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid var(--neutral-200)'
            }}>
              {floor.matrix.map((row, rIdx) => 
                row.map((cell, cIdx) => {
                  const typeDef = CELL_TYPES[cell.type.toUpperCase()] || CELL_TYPES.EMPTY;
                  return (
                    <div 
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => handleCellClick(floor.floorIndex, rIdx, cIdx)}
                      style={{
                        width: '40px', height: '40px',
                        backgroundColor: typeDef.color,
                        border: `2px solid ${typeDef.border}`,
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: 'var(--neutral-700)',
                        userSelect: 'none',
                        transition: 'all 0.2s'
                      }}
                      title={`Hàng ${rIdx + 1}, Cột ${cIdx + 1}`}
                    >
                      {cell.type === 'seat' ? '💺' : cell.type === 'wc' ? 'WC' : cell.type === 'driver' ? '👨‍✈️' : ''}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving} style={{ padding: '12px 24px', fontSize: '16px' }}>
          {isSaving ? 'Đang lưu...' : 'Lưu Sơ Đồ'}
        </button>
      </div>
    </div>
  );
};

export default BusLayoutBuilder;
