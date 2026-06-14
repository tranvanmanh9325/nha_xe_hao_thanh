import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const TimePicker = ({ value, onChange, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const hourRef = useRef(null);
  const minuteRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (containerRef.current && !containerRef.current.contains(event.target)) &&
        (popupRef.current && !popupRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = (e) => {
      // Don't close if scrolling inside the popup itself
      if (popupRef.current && popupRef.current.contains(e.target)) return;
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  const currentHour = value ? value.split(':')[0] : '';
  const currentMinute = value ? value.split(':')[1] : '';

  useEffect(() => {
    if (isOpen) {
      // Tự động cuộn đến giờ/phút đã chọn khi mở
      if (currentHour && hourRef.current) {
        const selectedEl = hourRef.current.querySelector(`[data-val="${currentHour}"]`);
        if (selectedEl) selectedEl.scrollIntoView({ block: 'center' });
      }
      if (currentMinute && minuteRef.current) {
        const selectedEl = minuteRef.current.querySelector(`[data-val="${currentMinute}"]`);
        if (selectedEl) selectedEl.scrollIntoView({ block: 'center' });
      }
    }
  }, [isOpen, currentHour, currentMinute]);

  const toggleOpen = () => {
    if (!isOpen) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 180) // Căn độ rộng tối thiểu cho đẹp
      });
    }
    setIsOpen(!isOpen);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleHourSelect = (h) => {
    const newMinute = currentMinute || '00';
    onChange(`${h}:${newMinute}`);
  };

  const handleMinuteSelect = (m) => {
    const newHour = currentHour || '00';
    onChange(`${newHour}:${m}`);
    // Đóng popup sau khi đã chọn xong phút
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', ...style }}>
      <div 
        onClick={toggleOpen}
        style={{
          padding: 'var(--space-2) 32px var(--space-2) var(--space-3)',
          border: '1px solid',
          borderColor: isOpen ? 'var(--brand-500)' : 'var(--neutral-300)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          backgroundColor: 'var(--white)',
          cursor: 'pointer',
          minWidth: '80px',
          color: value ? 'var(--neutral-900)' : 'var(--neutral-500)',
          boxShadow: isOpen ? '0 0 0 3px var(--brand-100)' : 'none',
          transition: 'all var(--transition-fast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          userSelect: 'none',
          height: '42px',
          boxSizing: 'border-box'
        }}
      >
        <span>{value || '--:--'}</span>
        <svg 
          width="16" height="16" viewBox="0 0 24 24" fill="none" 
          stroke="var(--neutral-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: '12px' }}
        >
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </div>

      {isOpen && createPortal(
        <div 
          ref={popupRef}
          style={{
            position: 'absolute',
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            height: '250px',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', borderBottom: '1px solid var(--neutral-100)' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: '12px', fontWeight: 'bold', color: 'var(--neutral-500)', borderRight: '1px solid var(--neutral-100)' }}>Giờ</div>
            <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', fontSize: '12px', fontWeight: 'bold', color: 'var(--neutral-500)' }}>Phút</div>
          </div>
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Cột Giờ */}
            <div ref={hourRef} style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid var(--neutral-100)', scrollBehavior: 'smooth' }}>
              {hours.map(h => (
                <div 
                  key={h}
                  data-val={h}
                  onClick={() => handleHourSelect(h)}
                  style={{
                    padding: '8px 0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: h === currentHour ? 'var(--brand-50)' : 'transparent',
                    color: h === currentHour ? 'var(--brand-600)' : 'var(--neutral-700)',
                    fontWeight: h === currentHour ? 'bold' : 'normal',
                    fontSize: 'var(--text-sm)',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (h !== currentHour) e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                  }}
                  onMouseLeave={(e) => {
                    if (h !== currentHour) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            {/* Cột Phút */}
            <div ref={minuteRef} style={{ flex: 1, overflowY: 'auto', scrollBehavior: 'smooth' }}>
              {minutes.map(m => (
                <div 
                  key={m}
                  data-val={m}
                  onClick={() => handleMinuteSelect(m)}
                  style={{
                    padding: '8px 0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: m === currentMinute ? 'var(--brand-50)' : 'transparent',
                    color: m === currentMinute ? 'var(--brand-600)' : 'var(--neutral-700)',
                    fontWeight: m === currentMinute ? 'bold' : 'normal',
                    fontSize: 'var(--text-sm)',
                    transition: 'background-color var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (m !== currentMinute) e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                  }}
                  onMouseLeave={(e) => {
                    if (m !== currentMinute) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div style={{ padding: '8px', borderTop: '1px solid var(--neutral-100)', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--white)' }}>
            <button
              type="button"
              onClick={() => {
                onChange('');
                setIsOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--neutral-500)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                padding: '4px 8px'
              }}
            >
              Xóa
            </button>
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                const h = now.getHours().toString().padStart(2, '0');
                const m = now.getMinutes().toString().padStart(2, '0');
                onChange(`${h}:${m}`);
                setIsOpen(false);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-600)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                fontWeight: 'bold',
                padding: '4px 8px'
              }}
            >
              Hiện tại
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default TimePicker;
