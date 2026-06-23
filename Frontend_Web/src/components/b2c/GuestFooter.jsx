import { Link } from 'react-router-dom';
import { BusIcon, PhoneIcon } from '../icons/CustomIcons';

const GuestFooter = ({ settings }) => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
              <BusIcon className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">HÀO THANH</span>
          </div>
          <p className="mb-4 max-w-sm">Dịch vụ vận tải hành khách cao cấp tuyến Hà Nội - Nghệ An - Hà Tĩnh.</p>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="w-4 h-4 text-brand-500" />
            <span className="text-white font-semibold">Hotline: {settings?.hotline || '1900 xxxx'}</span>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Về Chúng Tôi</h4>
          <ul className="space-y-2">
            <li><Link to="/gioi-thieu" className="hover:text-brand-400 transition-colors">Giới thiệu</Link></li>
            <li><Link to="/tuyen-dung" className="hover:text-brand-400 transition-colors">Tuyển dụng</Link></li>
            <li><Link to="/tin-tuc" className="hover:text-brand-400 transition-colors">Tin tức</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Hỗ Trợ</h4>
          <ul className="space-y-2">
            <li><Link to="#" className="hover:text-brand-400 transition-colors">Quy định chung</Link></li>
            <li><Link to="#" className="hover:text-brand-400 transition-colors">Chính sách bảo mật</Link></li>
            <li><Link to="#" className="hover:text-brand-400 transition-colors">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-neutral-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Nhà Xe Hào Thanh. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default GuestFooter;