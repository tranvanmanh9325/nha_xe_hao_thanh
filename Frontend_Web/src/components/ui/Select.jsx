import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Select = ({ value, onChange, options, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef(null);
  const popupRef = useRef(null);

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
      // Bỏ qua nếu cuộn bên trong chính dropdown
      if (popupRef.current && popupRef.current.contains(e.target)) return;
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true); // Bắt sự kiện scroll trên tất cả phần tử (capture phase)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4, // 4px margin top
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const selectedOption = options.find(opt => opt.value === value) || options[0];

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
          color: 'var(--neutral-900)',
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
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.label}
        </span>
        <svg 
          width="16" height="16" viewBox="0 0 24 24" fill="none" 
          stroke="var(--neutral-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{
            position: 'absolute',
            right: '12px',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform var(--transition-fast)'
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
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
            zIndex: 9999, // Render trên tất cả các Modal
            maxHeight: '250px',
            overflowY: 'auto'
          }}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-sm)',
                color: option.value === value ? 'var(--brand-700)' : 'var(--neutral-700)',
                backgroundColor: option.value === value ? 'var(--brand-50)' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color var(--transition-fast)',
                userSelect: 'none',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = 'var(--neutral-50)';
                }
              }}
              onMouseLeave={(e) => {
                if (option.value !== value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {option.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default Select;
