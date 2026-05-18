import QuickStats from '../components/dashboard/QuickStats';
import DataTable from '../components/ui/DataTable';
import { statsData, tripsData } from '../data/mockData';
import '../styles/dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* KPI Overview Cards */}
      <QuickStats stats={statsData} />

      {/* Upcoming Trips Table */}
      <DataTable trips={tripsData} />
    </div>
  );
};

export default Dashboard;
