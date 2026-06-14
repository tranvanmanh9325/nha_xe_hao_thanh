import { useState, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO, isValid } from 'date-fns';
import { createPortal } from 'react-dom';

const DatePicker = ({ value, onChange, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value && isValid(parseISO(value)) ? parseISO(value) : new Date());
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
      // Don't close if scrolling inside the popup itself
      if (popupRef.current && popupRef.current.contains(e.target)) return;
      if (isOpen) setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true); // true for capture phase to catch scroll on any element

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
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setCurrentMonth(value && isValid(parseISO(value)) ? parseISO(value) : new Date());
    }
    setIsOpen(!isOpen);
  };

  const handleDateClick = (day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const renderHeader = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-2) var(--space-3)', borderBottom: '1px solid var(--neutral-200)' }}>
        <button type="button" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ background: 'var(--neutral-100)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-600)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div style={{ fontWeight: '600', fontSize: 'var(--text-sm)', color: 'var(--neutral-900)' }}>
          Tháng {format(currentMonth, 'M - yyyy')}
        </div>
        <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ background: 'var(--neutral-100)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--neutral-600)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', padding: '8px 8px 4px 8px' }}>
        {days.map((day, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--neutral-500)' }}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;
    const selectedDate = value && isValid(parseISO(value)) ? parseISO(value) : null;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const isSelected = selectedDate && isSameDay(day, selectedDate);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day}
            onClick={() => handleDateClick(cloneDay)}
            style={{
              padding: '6px',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              borderRadius: 'var(--radius-sm)',
              color: !isCurrentMonth ? 'var(--neutral-400)' : isSelected ? 'var(--white)' : isToday ? 'var(--brand-600)' : 'var(--neutral-900)',
              backgroundColor: isSelected ? 'var(--brand-500)' : 'transparent',
              fontWeight: isToday || isSelected ? 'bold' : 'normal',
              transition: 'all var(--transition-fast)',
              border: isToday && !isSelected ? '1px solid var(--brand-500)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'var(--brand-50)';
                e.currentTarget.style.color = 'var(--brand-600)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = !isCurrentMonth ? 'var(--neutral-400)' : isToday ? 'var(--brand-600)' : 'var(--neutral-900)';
              }
            }}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', padding: '0 8px 4px 8px' }}>
          {days}
        </div>
      );
      days = [];
    }
    return <div style={{ paddingBottom: '8px' }}>{rows}</div>;
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
          height: '42px', // matches form-control typical height
          boxSizing: 'border-box'
        }}
      >
        <span>{value && isValid(parseISO(value)) ? format(parseISO(value), 'dd/MM/yyyy') : 'dd/mm/yyyy'}</span>
        <svg 
          width="16" height="16" viewBox="0 0 24 24" fill="none" 
          stroke="var(--neutral-500)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: '12px' }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>

      {isOpen && createPortal(
        <div 
          ref={popupRef}
          style={{
            position: 'absolute',
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            backgroundColor: 'var(--white)',
            border: '1px solid var(--neutral-200)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999, // Cao hơn modal
            minWidth: '280px',
            overflow: 'hidden'
          }}
        >
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <div style={{ padding: '8px', borderTop: '1px solid var(--neutral-100)', display: 'flex', justifyContent: 'space-between' }}>
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
                const today = format(new Date(), 'yyyy-MM-dd');
                onChange(today);
                setCurrentMonth(new Date());
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
              Hôm nay
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default DatePicker;
