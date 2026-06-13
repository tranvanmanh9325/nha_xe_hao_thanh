import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneIcon, LockIcon, UserIcon, EyeIcon, EyeSlashIcon } from '../icons/CustomIcons';
import { login } from '../../utils/authService';

const AuthModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resetForm = () => {
    setPhone('');
    setPassword('');
    setFullName('');
    setConfirmPassword('');
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    resetForm();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ số điện thoại và mật khẩu.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(phone, password);
      resetForm();
      onClose();
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    // Registration is not yet implemented on backend
    setError('Chức năng đăng ký đang được phát triển. Vui lòng liên hệ hotline.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Left Column - Branding (hidden on mobile) */}
        <div className="hidden md:flex flex-col justify-center items-start w-1/2 p-12 bg-gradient-to-br from-brand-500 to-brand-700 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Hành trình<br/>đẳng cấp</h2>
            <p className="text-brand-100 text-lg mb-8 leading-relaxed">
              Trải nghiệm dịch vụ xe khách giường nằm cao cấp 5 sao. Đặt vé nhanh chóng, tiện lợi và an toàn cùng Hào Thanh.
            </p>
            
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/20 border-2 border-brand-600 backdrop-blur-md flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-medium">+10,000 khách hàng tin tưởng</p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white flex flex-col justify-center">
          {/* Tabs */}
          <div className="flex w-full mb-8 border-b border-gray-200">
            <button
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 pb-4 text-center font-semibold text-lg transition-all duration-300 relative ${
                activeTab === 'login' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Đăng nhập
              {activeTab === 'login' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-t-full"></span>
              )}
            </button>
            <button
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 pb-4 text-center font-semibold text-lg transition-all duration-300 relative ${
                activeTab === 'register' ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Đăng ký
              {activeTab === 'register' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 rounded-t-full"></span>
              )}
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {activeTab === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản mới'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'login' ? 'Vui lòng đăng nhập để quản lý vé xe.' : 'Đăng ký để nhận nhiều ưu đãi hấp dẫn.'}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={activeTab === 'login' ? handleLogin : handleRegister}>
            
            {/* Full name field (Register only) */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Phone field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <PhoneIcon className="w-5 h-5" />
                </div>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError(''); }}
                  placeholder="09xx xxx xxx"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                {activeTab === 'login' && (
                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">Quên mật khẩu?</a>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <LockIcon className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeIcon className="w-5 h-5"/> : <EyeSlashIcon className="w-5 h-5"/>}
                </button>
              </div>
            </div>

            {/* Confirm password field (Register only) */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <LockIcon className="w-5 h-5" />
                  </div>
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeIcon className="w-5 h-5"/> : <EyeSlashIcon className="w-5 h-5"/>}
                  </button>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 mt-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/30 transition-all hover:shadow-brand-500/50 active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </span>
              ) : (
                activeTab === 'login' ? 'Đăng Nhập' : 'Tạo Tài Khoản'
              )}
            </button>
            
          </form>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
