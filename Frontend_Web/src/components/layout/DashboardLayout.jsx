import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import '../../styles/layout.css';

/* Map pathname to Vietnamese page title for the top nav */
const pageTitles = {
  '/admin': 'Tổng quan',
  '/admin/routes': 'Quản lý tuyến đường',
  '/admin/trips': 'Quản lý chuyến xe',
  '/admin/buses': 'Quản lý xe',
  '/admin/tickets': 'Quản lý vé',
  '/admin/revenue': 'Thống kê doanh thu',
  '/admin/settings': 'Cài đặt',
};

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] || 'Tổng quan';

  return (
    <div className="layout">
      <Sidebar />
      <TopNav title={title} />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
