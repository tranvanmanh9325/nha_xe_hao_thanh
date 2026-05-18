import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import '../../styles/layout.css';

/* Map pathname to Vietnamese page title for the top nav */
const pageTitles = {
  '/': 'Tổng quan',
  '/trips': 'Quản lý chuyến xe',
  '/seat-map': 'Sơ đồ ghế',
  '/tickets': 'Quản lý vé',
  '/revenue': 'Thống kê doanh thu',
  '/settings': 'Cài đặt',
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
