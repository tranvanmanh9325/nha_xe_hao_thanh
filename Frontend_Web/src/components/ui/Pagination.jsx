import Select from './Select';

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const selectOptions = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 50, label: '50' }
  ];

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200">
      {/* Left side: Info and Row per page */}
      <div className="flex items-center gap-6">
        <div className="text-sm text-slate-600">
          Hiển thị <span className="font-semibold text-slate-800">{startItem}</span> đến <span className="font-semibold text-slate-800">{endItem}</span> trong tổng số <span className="font-semibold text-slate-800">{totalItems}</span> chuyến xe
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Số dòng:</span>
          <Select 
            value={itemsPerPage}
            onChange={(val) => onItemsPerPageChange(Number(val))}
            options={selectOptions}
          />
        </div>
      </div>

      {/* Right side: Pagination buttons */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
            currentPage === 1 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="Previous page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="flex items-end justify-center w-8 h-8 text-slate-400 pb-1">...</span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 ${
            currentPage === totalPages 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="Next page"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
