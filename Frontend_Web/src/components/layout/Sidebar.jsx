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
  MessageIcon,
} from '../../assets/icons';
import { logout } from '../../utils/authService';
import '../../styles/sidebar.css';

/* Navigation items config — single source of truth for sidebar menu */
const navItems = [
  { to: '/admin', icon: DashboardIcon, label: 'Tổng quan' },
  { to: '/admin/routes', icon: MapIcon, label: 'Quản lý tuyến đường' },
  { to: '/admin/trips', icon: BusRouteIcon, label: 'Quản lý chuyến xe' },
  { to: '/admin/buses', icon: BusIcon, label: 'Quản lý xe' },
  { to: '/admin/tickets', icon: TicketIcon, label: 'Quản lý vé' },
  { to: '/admin/revenue', icon: ChartIcon, label: 'Thống kê doanh thu' },
  { to: '/admin/chat', icon: MessageIcon, label: 'Chat Hỗ trợ' },
  { to: '/admin/settings', icon: SettingsIcon, label: 'Cài đặt' },
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
            end={to === '/admin'}
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
        <button className="sidebar__logout" type="button" onClick={logout}>
          <LogoutIcon size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;