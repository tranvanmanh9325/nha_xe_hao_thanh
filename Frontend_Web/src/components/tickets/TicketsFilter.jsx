import { SearchIcon } from '../../assets/icons';
import Select from '../ui/Select';

const TicketsFilter = ({ 
  searchTerm, 
  onSearchChange, 
  tripFilter, 
  onTripFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  uniqueTrips = []
}) => {
  const tripOptions = [
    { value: 'all', label: 'Tất cả chuyến xe' },
    ...uniqueTrips
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'unpaid', label: 'Chưa thanh toán' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const dateOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Ngày đặt: Hôm nay' },
    { value: 'yesterday', label: 'Ngày đặt: Hôm qua' },
    { value: 'this_week', label: 'Ngày đặt: Tuần này' },
    { value: 'this_month', label: 'Ngày đặt: Tháng này' }
  ];

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

      <Select 
        value={tripFilter}
        onChange={onTripFilterChange}
        options={tripOptions}
        style={{ minWidth: '180px' }}
      />

      <Select 
        value={statusFilter}
        onChange={onStatusFilterChange}
        options={statusOptions}
        style={{ minWidth: '180px' }}
      />

      <Select 
        value={dateFilter}
        onChange={onDateFilterChange}
        options={dateOptions}
        style={{ minWidth: '180px' }}
      />
    </div>
  );
};

export default TicketsFilter;
