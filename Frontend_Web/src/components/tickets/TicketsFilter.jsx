import { SearchIcon, ChevronDownIcon } from '../../assets/icons';

const TicketsFilter = ({ 
  searchTerm, 
  onSearchChange, 
  tripFilter, 
  onTripFilterChange,
  statusFilter,
  onStatusFilterChange
}) => {
  return (
    <div className="tickets-filter">
      <div className="tickets-filter__search">
        <SearchIcon size={16} className="tickets-filter__search-icon" />
        <input
          type="text"
          className="tickets-filter__input"
          placeholder="Tìm theo mã vé, tên, SĐT..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="tickets-filter__select-wrapper">
        <select 
          className="tickets-filter__select"
          value={tripFilter}
          onChange={(e) => onTripFilterChange(e.target.value)}
        >
          <option value="all">Tất cả chuyến xe</option>
          <option value="HT-2401">HT-2401 (TP.HCM - Đà Lạt)</option>
          <option value="HT-2402">HT-2402 (TP.HCM - Nha Trang)</option>
          <option value="HT-2403">HT-2403 (Đà Lạt - TP.HCM)</option>
          <option value="HT-2404">HT-2404 (TP.HCM - BMT)</option>
          <option value="HT-2405">HT-2405 (Nha Trang - TP.HCM)</option>
        </select>
        <ChevronDownIcon size={16} className="tickets-filter__select-icon" />
      </div>

      <div className="tickets-filter__select-wrapper">
        <select 
          className="tickets-filter__select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="paid">Đã thanh toán</option>
          <option value="unpaid">Chưa thanh toán</option>
          <option value="cancelled">Đã hủy</option>
        </select>
        <ChevronDownIcon size={16} className="tickets-filter__select-icon" />
      </div>

      <div className="tickets-filter__select-wrapper">
        <select className="tickets-filter__select">
          <option value="today">Ngày đặt: Hôm nay</option>
          <option value="yesterday">Ngày đặt: Hôm qua</option>
          <option value="this_week">Ngày đặt: Tuần này</option>
          <option value="this_month">Ngày đặt: Tháng này</option>
        </select>
        <ChevronDownIcon size={16} className="tickets-filter__select-icon" />
      </div>
    </div>
  );
};

export default TicketsFilter;
