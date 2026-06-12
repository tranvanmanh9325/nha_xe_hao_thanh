import { NavLink } from 'react-router-dom';
import {
  DashboardIcon,
  MapIcon,
  BusRouteIcon,
  BusIcon,
  TicketIcon,
  ChartIcon,
  SettingsIcon,
  LogoutIcon,
} from '../../assets/icons';
import '../../styles/sidebar.css';

/* Navigation items config — single source of truth for sidebar menu */
const navItems = [
  { to: '/', icon: DashboardIcon, label: 'Tổng quan' },
  { to: '/routes', icon: MapIcon, label: 'Quản lý tuyến đường' },
  { to: '/trips', icon: BusRouteIcon, label: 'Quản lý chuyến xe' },
  { to: '/buses', icon: BusIcon, label: 'Quản lý xe' },
  { to: '/tickets', icon: TicketIcon, label: 'Quản lý vé' },
  { to: '/revenue', icon: ChartIcon, label: 'Thống kê doanh thu' },
  { to: '/settings', icon: SettingsIcon, label: 'Cài đặt' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Brand / Logo */}
      <div className="sidebar__brand">
        <div className="sidebar__logo">HT</div>
        <div>
          <div className="sidebar__brand-name">Hào Thanh</div>
          <div className="sidebar__brand-sub">Quản lý nhà xe</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__nav-label">Menu chính</div>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
            }
          >
            <Icon size={20} className="sidebar__nav-icon" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar__footer">
        <button className="sidebar__logout" type="button">
          <LogoutIcon size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
