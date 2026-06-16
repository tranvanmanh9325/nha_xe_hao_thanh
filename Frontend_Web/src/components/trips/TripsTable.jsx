import React, { useState, useEffect, useRef } from 'react';
import StatusBadge from '../ui/StatusBadge';
import { EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '../../assets/icons';

const TripRow = ({ trip, onEdit, onDelete, onCancel, onBookTicket }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format departureTime: HH:mm - DD/MM/YYYY
  const depDate = new Date(trip.departureTime);
  const formattedTime = !isNaN(depDate) 
    ? `${String(depDate.getHours()).padStart(2, '0')}:${String(depDate.getMinutes()).padStart(2, '0')} - ${String(depDate.getDate()).padStart(2, '0')}/${String(depDate.getMonth() + 1).padStart(2, '0')}/${depDate.getFullYear()}`
    : trip.departureTime || 'N/A';
    
  // Format basePrice: VND
  const formattedPrice = trip.basePrice != null
    ? trip.basePrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : '0 ₫';

  return (
    <tr>
      <td className="trips-table__code">{trip.id}</td>
      <td>{trip.route}</td>
      <td>{formattedTime}</td>
      <td>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 'bold', backgroundColor: 'var(--gray-100)', color: 'var(--gray-800)', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', width: 'fit-content' }}>
            Số {trip.busNumber || '01'}
          </span>
          <span>{trip.licensePlate || 'Chưa xếp xe'}</span>
        </div>
      </td>
      <td>{trip.driver || 'Chưa phân công'}</td>
      <td>{formattedPrice}</td>
      <td>
        <StatusBadge status={trip.status} />
      </td>
      <td>
        <div className="relative flex justify-center" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`p-1.5 rounded-md transition-colors ${isDropdownOpen ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-1/2 translate-x-1/2 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 overflow-hidden">
              {trip.status === 'SCHEDULED' ? (
                <button 
                  onClick={() => { setIsDropdownOpen(false); onBookTicket && onBookTicket(trip); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-brand-600 hover:bg-brand-50 flex items-center gap-2.5 font-medium transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 10v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
                    <path d="M12 2v8" />
                    <path d="m8 6 4-4 4 4" />
                    <path d="M4 14h16" />
                  </svg>
                  Đặt vé
                </button>
              ) : (
                <button 
                  onClick={() => { setIsDropdownOpen(false); onBookTicket && onBookTicket(trip); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Xem sơ đồ
                </button>
              )}
              
              <button 
                onClick={() => { setIsDropdownOpen(false); onEdit && onEdit(trip); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <EditIcon size={16} />
                Chỉnh sửa
              </button>

              {trip.status === 'SCHEDULED' && (
                <button 
                  onClick={() => { setIsDropdownOpen(false); onCancel && onCancel(trip); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 flex items-center gap-2.5 font-medium transition-colors border-t border-slate-100"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  Hủy chuyến
                </button>
              )}

              <button 
                onClick={() => { setIsDropdownOpen(false); onDelete && onDelete(trip); }}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium transition-colors"
              >
                <TrashIcon size={16} />
                Xóa chuyến
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

const TripsTable = ({ data = [], isLoading, error, currentPage, totalPages, onPageChange, onEdit, onDelete, onCancel, onBookTicket }) => {
  return (
    <div className="trips-table-container">
      <table className="trips-table">
        <thead>
          <tr>
            <th>Mã chuyến</th>
            <th>Tuyến đường</th>
            <th>Khởi hành</th>
            <th>Thông tin xe</th>
            <th>Tài xế</th>
            <th>Giá vé</th>
            <th>Trạng thái</th>
            <th style={{ minWidth: '100px', textAlign: 'center' }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                Đang tải dữ liệu...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-danger)' }}>
                {error}
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
                Không tìm thấy chuyến xe nào.
              </td>
            </tr>
          ) : (
            data.map((trip) => (
              <TripRow 
                key={trip.id} 
                trip={trip} 
                onEdit={onEdit} 
                onDelete={onDelete} 
                onCancel={onCancel}
                onBookTicket={onBookTicket}
              />
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="trips-pagination">
        <div className="trips-pagination__info">
          Hiển thị {(currentPage - 1) * 10 + 1}-{Math.min(currentPage * 10, currentPage * 10 /* mock total */)} trong tổng số nhiều chuyến
        </div>
        <div className="trips-pagination__controls">
          <button 
            className="trips-pagination__btn" 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeftIcon size={16} />
          </button>
          <span className="trips-pagination__page">{currentPage}</span>
          <button 
            className="trips-pagination__btn" 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripsTable;