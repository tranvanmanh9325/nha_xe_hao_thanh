import { Link, useLocation } from 'react-router-dom';
import { BusIcon } from '../icons/CustomIcons';

const GuestNavbar = ({ onOpenAuthModal }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Lịch trình', path: '/lich-trinh' },
    { name: 'Tra cứu vé', path: '/tra-cuu-ve' },
    { name: 'Khuyến mãi', path: '/khuyen-mai' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white">
              <BusIcon className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-brand-600 tracking-tight">HÀO THANH</span>
          </Link>

          {/* Navigation (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`font-semibold transition-colors ${
                  location.pathname === link.path 
                    ? 'text-brand-600' 
                    : 'text-neutral-600 hover:text-brand-500'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Login Button */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onOpenAuthModal}
              className="hidden md:block px-4 py-2 text-brand-600 font-semibold hover:bg-brand-50 rounded-lg transition-colors"
            >
              Đăng nhập
            </button>
            <button 
              onClick={onOpenAuthModal}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all hover:shadow-brand-500/40 active:scale-95"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GuestNavbar;
