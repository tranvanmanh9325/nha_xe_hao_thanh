import { SearchIcon, ChevronDownIcon } from '../../assets/icons';

const TripsFilter = ({ searchTerm, onSearchChange, routeFilter, onRouteFilterChange, statusFilter, onStatusFilterChange }) => {
  return (
    <div className="trips-filter">
      <div className="trips-filter__search">
        <SearchIcon size={16} className="trips-filter__search-icon" />
        <input
          type="text"
          className="trips-filter__input"
          placeholder="Tìm theo mã chuyến, biển số xe..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="trips-filter__select-wrapper">
        <select 
          className="trips-filter__select"
          value={routeFilter}
          onChange={(e) => onRouteFilterChange(e.target.value)}
        >
          <option value="all">Tất cả tuyến đường</option>
          <option value="Sài Gòn - Đà Lạt">Sài Gòn - Đà Lạt</option>
          <option value="Đà Lạt - Sài Gòn">Đà Lạt - Sài Gòn</option>
          <option value="Sài Gòn - Nha Trang">Sài Gòn - Nha Trang</option>
        </select>
        <ChevronDownIcon size={16} className="trips-filter__select-icon" />
      </div>

      <div className="trips-filter__select-wrapper">
        <select 
          className="trips-filter__select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="upcoming">Sắp chạy</option>
          <option value="running">Đang chạy</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Hủy</option>
        </select>
        <ChevronDownIcon size={16} className="trips-filter__select-icon" />
      </div>

      <div className="trips-filter__select-wrapper">
        <select className="trips-filter__select">
          <option value="today">Hôm nay</option>
          <option value="tomorrow">Ngày mai</option>
          <option value="this_week">Tuần này</option>
        </select>
        <ChevronDownIcon size={16} className="trips-filter__select-icon" />
      </div>
    </div>
  );
};

export default TripsFilter;
