import { SearchIcon } from '../../assets/icons';
import Select from '../ui/Select';

const TripsFilter = ({ 
  searchTerm, onSearchChange, 
  routeFilter, onRouteFilterChange, 
  statusFilter, onStatusFilterChange, 
  timeFilter, onTimeFilterChange,
  routes = [] 
}) => {
  const routeOptions = [
    { value: 'all', label: 'Tất cả tuyến đường' },
    ...routes.map((route) => ({
      value: `${route.origin} - ${route.destination}`,
      label: `${route.origin} - ${route.destination}`
    }))
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'SCHEDULED', label: 'Sắp chạy' },
    { value: 'IN_PROGRESS', label: 'Đang chạy' },
    { value: 'COMPLETED', label: 'Hoàn thành' },
    { value: 'CANCELLED', label: 'Hủy' }
  ];

  const timeOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'tomorrow', label: 'Ngày mai' },
    { value: 'this_week', label: 'Tuần này' }
  ];

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

      <Select 
        value={routeFilter}
        onChange={onRouteFilterChange}
        options={routeOptions}
        style={{ minWidth: '200px' }}
      />

      <Select 
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={statusOptions}
        style={{ minWidth: '160px' }}
      />

      <Select 
        value={timeFilter}
        onChange={onTimeFilterChange}
        options={timeOptions}
        style={{ minWidth: '160px' }}
      />
    </div>
  );
};

export default TripsFilter;