import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Ticket, XCircle } from 'lucide-react';
import { getRevenueStatistics } from '../utils/dashboardService';
import Select from '../components/ui/Select';
import DatePicker from '../components/ui/DatePicker';
import '../styles/Revenue.css';

const COLORS = ['#F05123', '#F59E0B', '#2563EB', '#9CA3AF'];

const Revenue = () => {
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const calculateDatesForFilter = (filter) => {
    let start = new Date();
    let end = new Date();
    end.setHours(23, 59, 59, 999);

    if (filter === 'Hôm nay') {
      start.setHours(0, 0, 0, 0);
    } else if (filter === 'Tuần này') {
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else if (filter === 'Tháng này') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);

      end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    } else if (filter === 'Năm nay') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);

      end = new Date(start.getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
    }
    return { start, end };
  };

  const initialDates = calculateDatesForFilter('Tuần này');
  const [timeFilter, setTimeFilter] = useState('Tuần này');
  const [startDate, setStartDate] = useState(() => formatDate(initialDates.start));
  const [endDate, setEndDate] = useState(() => formatDate(initialDates.end));
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    totalRevenue: { label: 'Tổng doanh thu', value: '0 đ', trend: 0, trendLabel: '' },
    totalTickets: { label: 'Tổng số vé đã bán', value: '0', trend: 0, trendLabel: '' },
    cancellationRate: { label: 'Tỷ lệ hủy vé', value: '0%', trend: 0, trendLabel: '' },
    revenueByTime: [],
    revenueByRoute: []
  });

  useEffect(() => {
    if (!startDate || !endDate) return;

    let start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    let end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await getRevenueStatistics(start, end);
        setData(stats);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê doanh thu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    if (newFilter !== 'Tùy chỉnh') {
      const { start, end } = calculateDatesForFilter(newFilter);
      setStartDate(formatDate(start));
      setEndDate(formatDate(end));
    }
  };

  const handleDateChange = (type, value) => {
    setTimeFilter('Tùy chỉnh');
    if (type === 'start') setStartDate(value);
    if (type === 'end') setEndDate(value);
  };

  return (
    <div className="revenue-container">
      {/* Header & Filters */}
      <div className="revenue-header">
        <h2 className="page-title">Thống kê doanh thu</h2>
        
        <div className="filters-group">
          <Select
            value={timeFilter}
            onChange={handleTimeFilterChange}
            options={[
              { value: 'Hôm nay', label: 'Hôm nay' },
              { value: 'Tuần này', label: 'Tuần này' },
              { value: 'Tháng này', label: 'Tháng này' },
              { value: 'Năm nay', label: 'Năm nay' },
              { value: 'Tùy chỉnh', label: 'Tùy chỉnh' },
            ]}
            style={{ width: '160px' }}
          />
          
          <div className="date-picker-group" style={{ border: 'none', padding: 0, gap: '8px', background: 'transparent' }}>
            <DatePicker 
              value={startDate}
              onChange={(val) => handleDateChange('start', val)}
              style={{ minWidth: '140px' }}
            />
            <span className="text-muted" style={{ padding: '0 4px' }}>-</span>
            <DatePicker 
              value={endDate}
              onChange={(val) => handleDateChange('end', val)}
              style={{ minWidth: '140px' }}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon bg-brand-light">
            <DollarSign size={24} color="var(--brand-500)" />
          </div>
          <div className="card-info">
            <p className="card-label">{data.totalRevenue.label}</p>
            <h3 className="card-value">{loading ? '...' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.totalRevenue.value)}</h3>
            <div className={`card-trend ${data.totalRevenue.trend >= 0 ? 'trend-up' : 'trend-down'}`}>
              {data.totalRevenue.trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{data.totalRevenue.trend > 0 ? '+' : ''}{data.totalRevenue.trend}% {data.totalRevenue.trendLabel}</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon bg-info-light">
            <Ticket size={24} color="var(--info)" />
          </div>
          <div className="card-info">
            <p className="card-label">{data.totalTickets.label}</p>
            <h3 className="card-value">{loading ? '...' : new Intl.NumberFormat('vi-VN').format(data.totalTickets.value)}</h3>
            <div className={`card-trend ${data.totalTickets.trend >= 0 ? 'trend-up' : 'trend-down'}`}>
              {data.totalTickets.trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{data.totalTickets.trend > 0 ? '+' : ''}{data.totalTickets.trend}% {data.totalTickets.trendLabel}</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon bg-danger-light">
            <XCircle size={24} color="var(--danger)" />
          </div>
          <div className="card-info">
            <p className="card-label">{data.cancellationRate.label}</p>
            <h3 className="card-value">{loading ? '...' : `${data.cancellationRate.value}%`}</h3>
            <div className={`card-trend ${data.cancellationRate.trend > 0 ? 'trend-down' : 'trend-up'}`}>
              {data.cancellationRate.trend > 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              <span>{data.cancellationRate.trend > 0 ? '+' : ''}{data.cancellationRate.trend}% {data.cancellationRate.trendLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Area */}
      <div className="charts-grid">
        <div className="chart-card bar-chart-card">
          <div className="chart-header">
            <h3>Doanh thu theo thời gian</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueByTime} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'var(--neutral-500)', fontSize: 14}} 
                  dy={10} 
                />
                <Tooltip 
                  cursor={{fill: 'var(--neutral-100)'}}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 500}}
                  formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
                  labelStyle={{color: 'var(--neutral-900)', fontWeight: 600, marginBottom: '4px'}}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="var(--brand-500)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card pie-chart-card">
          <div className="chart-header">
            <h3>Tỷ trọng theo tuyến</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.revenueByRoute}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.revenueByRoute.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontWeight: 500}}
                  formatter={(value) => `${value}%`}
                  itemStyle={{color: 'var(--neutral-900)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="custom-legend">
              {data.revenueByRoute.map((entry, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-color" style={{backgroundColor: COLORS[index % COLORS.length]}}></span>
                  <span className="legend-label">{entry.name}</span>
                  <span className="legend-value">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenue;