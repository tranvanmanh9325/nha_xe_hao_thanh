import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const Select = ({ value, onChange, options, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0, isUp: false });
  const containerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    let isActive = true;
    const mountTime = Date.now();

    const handleClickOutside = (event) => {
      if (!isActive) return;
      if (
        (containerRef.current && !containerRef.current.contains(event.target)) &&
        (popupRef.current && !popupRef.current.contains(event.target))
      ) {
        setIsOpen(false);
      }
    };

    const handleScrollOrResize = (e) => {
      if (!isActive) return;
      
      // Bỏ qua nếu là sự kiện được trigger quá gần lúc mở dropdown (inertia scroll)
      if (Date.now() - mountTime < 150) return;

      // Bỏ qua nếu là sự kiện resize (e.target là window không phải Node) 
      // Hoặc nếu cuộn bên trong chính dropdown
      if (popupRef.current && e.target instanceof Node && popupRef.current.contains(e.target)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      isActive = false;
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Nếu không đủ chỗ phía dưới (ít hơn 200px) và phía trên rộng hơn
      const isUp = spaceBelow < 200 && spaceAbove > spaceBelow;

      setDropdownPos({
        top: isUp ? rect.top + window.scrollY - 4 : rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
        isUp
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
            transform: dropdownPos.isUp ? 'translateY(-100%)' : 'none',
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