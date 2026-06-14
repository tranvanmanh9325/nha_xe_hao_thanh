import { useState } from 'react';
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
import { Calendar, TrendingUp, TrendingDown, DollarSign, Ticket, XCircle } from 'lucide-react';
import '../styles/Revenue.css';

// Mock Data for Bar Chart
const revenueData = [
  { name: 'T2', revenue: 15000000 },
  { name: 'T3', revenue: 12000000 },
  { name: 'T4', revenue: 18000000 },
  { name: 'T5', revenue: 25000000 },
  { name: 'T6', revenue: 20000000 },
  { name: 'T7', revenue: 30000000 },
  { name: 'CN', revenue: 35000000 },
];

// Mock Data for Doughnut Chart
const routeData = [
  { name: 'Hà Nội - Nghệ An', value: 55 },
  { name: 'Nghệ An - Hà Nội', value: 35 },
  { name: 'Khác', value: 10 },
];

const COLORS = ['#F05123', '#F59E0B', '#2563EB', '#9CA3AF'];

const Revenue = () => {
  const [timeFilter, setTimeFilter] = useState('Tuần này');

  return (
    <div className="revenue-container">
      {/* Header & Filters */}
      <div className="revenue-header">
        <h2 className="page-title">Thống kê doanh thu</h2>
        
        <div className="filters-group">
          <select 
            className="time-select" 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="Hôm nay">Hôm nay</option>
            <option value="Tuần này">Tuần này</option>
            <option value="Tháng này">Tháng này</option>
            <option value="Năm nay">Năm nay</option>
          </select>
          
          <div className="date-picker-group">
            <Calendar size={18} className="text-muted" />
            <input type="date" className="date-input" />
            <span className="text-muted">-</span>
            <input type="date" className="date-input" />
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
            <p className="card-label">Tổng doanh thu</p>
            <h3 className="card-value">155,000,000 đ</h3>
            <div className="card-trend trend-up">
              <TrendingUp size={16} />
              <span>+12.5% so với kỳ trước</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon bg-info-light">
            <Ticket size={24} color="var(--info)" />
          </div>
          <div className="card-info">
            <p className="card-label">Tổng số vé đã bán</p>
            <h3 className="card-value">1,245</h3>
            <div className="card-trend trend-up">
              <TrendingUp size={16} />
              <span>+5.2% so với kỳ trước</span>
            </div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon bg-danger-light">
            <XCircle size={24} color="var(--danger)" />
          </div>
          <div className="card-info">
            <p className="card-label">Tỷ lệ hủy vé</p>
            <h3 className="card-value">2.4%</h3>
            <div className="card-trend trend-down">
              <TrendingDown size={16} />
              <span>-0.8% so với kỳ trước</span>
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
              <BarChart data={revenueData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
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
                  data={routeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {routeData.map((entry, index) => (
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
              {routeData.map((entry, index) => (
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