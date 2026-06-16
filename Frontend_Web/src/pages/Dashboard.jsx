import { useEffect, useState } from 'react';
import QuickStats from '../components/dashboard/QuickStats';
import DataTable from '../components/ui/DataTable';
import { getDashboardOverview } from '../utils/dashboardService';
import { toast } from 'react-toastify';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardOverview();
        
        const iconsAndVariants = {
          'Vé bán hôm nay': { iconName: 'TicketIcon', variant: 'brand' },
          'Chuyến sắp khởi hành': { iconName: 'BusRouteIcon', variant: 'info' },
          'Doanh thu hôm nay': { iconName: 'ChartIcon', variant: 'success' },
          'Khách hàng mới': { iconName: 'UsersIcon', variant: 'warning' },
        };
        
        const mappedStats = data.stats.map((stat, index) => ({
          id: `stat-${index}`,
          label: stat.label,
          value: stat.label.includes('Doanh thu') 
            ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stat.value)
            : new Intl.NumberFormat('vi-VN').format(stat.value),
          trend: stat.trend,
          trendLabel: stat.trendLabel,
          iconName: iconsAndVariants[stat.label]?.iconName || 'ChartIcon',
          variant: iconsAndVariants[stat.label]?.variant || 'brand',
        }));

        setStats(mappedStats);
        
        const mappedTrips = data.upcomingTrips.map((trip, idx) => {
          let mappedStatus = 'available';
          if (trip.status === 'running') mappedStatus = 'running';
          else if (trip.bookedSeats >= trip.totalSeats) mappedStatus = 'full';
          
          let from = trip.route;
          let to = '';
          if (trip.route.includes(' - ')) {
            const parts = trip.route.split(' - ');
            from = parts[0];
            to = parts[1] || '';
          } else if (trip.route.includes(' -> ')) {
            const parts = trip.route.split(' -> ');
            from = parts[0];
            to = parts[1] || '';
          }

          return {
            id: idx,
            code: trip.code,
            from,
            to,
            departure: new Date(trip.departureTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}),
            booked: trip.bookedSeats,
            totalSeats: trip.totalSeats,
            status: mappedStatus,
            driver: trip.driver
          };
        });
        
        setTrips(mappedTrips);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu tổng quan...</div>;
  }

  return (
    <div className="dashboard">
      {/* KPI Overview Cards */}
      <QuickStats stats={stats} />

      {/* Upcoming Trips Table */}
      <DataTable trips={trips} />
    </div>
  );
};

export default Dashboard;