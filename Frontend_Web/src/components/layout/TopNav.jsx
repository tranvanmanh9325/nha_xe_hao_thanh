import { SearchIcon, BellIcon, ChevronDownIcon } from '../../assets/icons';
import '../../styles/topnav.css';

const TopNav = ({ title = 'Tổng quan' }) => {
  return (
    <header className="topnav">
      {/* Left — Page title + Search */}
      <div className="topnav__left">
        <h1 className="topnav__title">{title}</h1>
        <div className="topnav__search">
          <SearchIcon size={18} className="topnav__search-icon" />
          <input
            type="text"
            className="topnav__search-input"
            placeholder="Tìm kiếm chuyến xe, vé, khách hàng..."
          />
        </div>
      </div>

      {/* Right — Notifications + User */}
      <div className="topnav__right">
        <button className="topnav__icon-btn" type="button" aria-label="Thông báo">
          <BellIcon size={20} />
          <span className="topnav__badge">3</span>
        </button>

        <div className="topnav__divider" />

        <button className="topnav__user" type="button">
          <div className="topnav__user-avatar">AD</div>
          <div className="topnav__user-info">
            <span className="topnav__user-name">Admin</span>
            <span className="topnav__user-role">Quản trị viên</span>
          </div>
          <ChevronDownIcon size={16} className="topnav__chevron" />
        </button>
      </div>
    </header>
  );
};

export default TopNav;
