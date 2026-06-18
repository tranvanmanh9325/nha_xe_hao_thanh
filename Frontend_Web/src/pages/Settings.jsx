import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchSettings, updateSettings } from '../utils/settingsService';
import { changePassword } from '../utils/authService';
import '../styles/settings.css';

// --- Custom SVG Icons ---
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18"/>
    <path d="M5 21V7l8-4 8 4v14"/>
    <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"/>
  </svg>
);

const SecurityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ConfigIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);


const Settings = () => {
  const [activeTab, setActiveTab] = useState('info');

  // Info State
  const defaultInfo = {
    companyName: '',
    hotline: '',
    address: '',
    email: ''
  };
  const [info, setInfo] = useState(defaultInfo);
  const [initialInfo, setInitialInfo] = useState(defaultInfo);

  // Security State
  const [security, setSecurity] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Config State
  const defaultConfig = {
    notifyNewTicket: false,
    autoCancelUnpaid: false
  };
  const [config, setConfig] = useState(defaultConfig);
  const [initialConfig, setInitialConfig] = useState(defaultConfig);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchSettings();
        if (data) {
          const fetchedInfo = {
            companyName: data.companyName || '',
            hotline: data.hotline || '',
            address: data.address || '',
            email: data.email || ''
          };
          const fetchedConfig = {
            notifyNewTicket: data.notifyNewTicket || false,
            autoCancelUnpaid: data.autoCancelUnpaid || false
          };
          setInfo(fetchedInfo);
          setInitialInfo(fetchedInfo);
          setConfig(fetchedConfig);
          setInitialConfig(fetchedConfig);
        }
      } catch (error) {
        toast.error(error.message || 'Lỗi khi tải cài đặt hệ thống');
      }
    };
    loadData();
  }, []);

  const handleInfoChange = (e) => {
    const { id, value } = e.target;
    setInfo(prev => ({ ...prev, [id]: value }));
  };

  const handleSecurityChange = (e) => {
    const { id, value } = e.target;
    setSecurity(prev => ({ ...prev, [id]: value }));
  };

  const handleConfigChange = (e) => {
    const { id, checked } = e.target;
    setConfig(prev => ({ ...prev, [id]: checked }));
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!info.companyName || !info.hotline || !info.address || !info.email) {
      toast.error('Vui lòng điền đầy đủ thông tin nhà xe.');
      return;
    }
    
    try {
      await updateSettings({ ...info, ...config });
      toast.success('Đã lưu thông tin nhà xe thành công!');
      setInitialInfo(info);
    } catch (error) {
      toast.error(error.message || 'Lỗi khi lưu thông tin');
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (!security.oldPassword || !security.newPassword || !security.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin mật khẩu.');
      return;
    }
    if (security.newPassword !== security.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }
    if (security.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    
    try {
      await changePassword(security.oldPassword, security.newPassword);
      toast.success('Đã đổi mật khẩu thành công!');
      setSecurity({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Lỗi khi đổi mật khẩu');
    }
  };

  const handleSaveConfig = async () => {
    try {
      await updateSettings({ ...info, ...config });
      toast.success('Đã lưu cấu hình hệ thống thành công!');
      setInitialConfig(config);
    } catch (error) {
      toast.error(error.message || 'Lỗi khi lưu cấu hình');
    }
  };

  const isInfoChanged = JSON.stringify(info) !== JSON.stringify(initialInfo);
  const isSecurityChanged = security.oldPassword !== '' || security.newPassword !== '' || security.confirmPassword !== '';
  const isConfigChanged = JSON.stringify(config) !== JSON.stringify(initialConfig);

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>Cài đặt hệ thống</h1>
        <p>Quản lý thông tin nhà xe, bảo mật và các cấu hình chung của hệ thống.</p>
      </div>

      <div className="settings-content">
        {/* Sidebar Menu for Tabs */}
        <div className="settings-sidebar">
          <button 
            className={`settings-tab ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <InfoIcon />
            Thông tin nhà xe
          </button>
          <button 
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <SecurityIcon />
            Bảo mật tài khoản
          </button>
          <button 
            className={`settings-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <ConfigIcon />
            Cấu hình hệ thống
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="settings-panel">
          
          {/* Panel: Thông tin nhà xe */}
          {activeTab === 'info' && (
            <div className="tab-pane fade-in">
              <h2 className="settings-panel-title">Thông tin chung</h2>
              <form onSubmit={handleSaveInfo}>
                <div className="settings-form-group">
                  <label htmlFor="companyName">Tên nhà xe</label>
                  <input 
                    type="text" 
                    id="companyName" 
                    placeholder="Nhập tên nhà xe" 
                    value={info.companyName} 
                    onChange={handleInfoChange} 
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="hotline">Hotline liên hệ</label>
                  <input 
                    type="text" 
                    id="hotline" 
                    placeholder="Nhập số điện thoại hotline" 
                    value={info.hotline} 
                    onChange={handleInfoChange} 
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="address">Địa chỉ văn phòng</label>
                  <input 
                    type="text" 
                    id="address" 
                    placeholder="Nhập địa chỉ văn phòng chính" 
                    value={info.address} 
                    onChange={handleInfoChange} 
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="email">Email liên hệ</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="Nhập email" 
                    value={info.email} 
                    onChange={handleInfoChange} 
                  />
                </div>
                
                <div className="settings-form-actions">
                  <button type="submit" className="btn-save" disabled={!isInfoChanged}>Lưu thay đổi</button>
                </div>
              </form>
            </div>
          )}

          {/* Panel: Bảo mật tài khoản */}
          {activeTab === 'security' && (
            <div className="tab-pane fade-in">
              <h2 className="settings-panel-title">Đổi mật khẩu</h2>
              <form onSubmit={handleSaveSecurity}>
                <div className="settings-form-group">
                  <label htmlFor="oldPassword">Mật khẩu cũ</label>
                  <input 
                    type="password" 
                    id="oldPassword" 
                    placeholder="Nhập mật khẩu hiện tại" 
                    value={security.oldPassword} 
                    onChange={handleSecurityChange} 
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="newPassword">Mật khẩu mới</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    placeholder="Nhập mật khẩu mới" 
                    value={security.newPassword} 
                    onChange={handleSecurityChange} 
                  />
                </div>
                <div className="settings-form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    placeholder="Nhập lại mật khẩu mới" 
                    value={security.confirmPassword} 
                    onChange={handleSecurityChange} 
                  />
                </div>
                
                <div className="settings-form-actions">
                  <button type="submit" className="btn-save" disabled={!isSecurityChanged}>Lưu mật khẩu</button>
                </div>
              </form>
            </div>
          )}

          {/* Panel: Cấu hình hệ thống */}
          {activeTab === 'config' && (
            <div className="tab-pane fade-in">
              <h2 className="settings-panel-title">Tùy chọn hệ thống</h2>
              
              <div className="toggle-list">
                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Nhận thông báo vé mới</h4>
                    <p>Hệ thống sẽ gửi thông báo âm thanh và popup khi có khách đặt vé trực tuyến.</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="notifyNewTicket" 
                      checked={config.notifyNewTicket} 
                      onChange={handleConfigChange} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-info">
                    <h4>Tự động hủy vé chưa thanh toán</h4>
                    <p>Hủy các vé đã đặt nhưng chưa được thanh toán sau 24 giờ.</p>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      id="autoCancelUnpaid" 
                      checked={config.autoCancelUnpaid} 
                      onChange={handleConfigChange} 
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-form-actions">
                <button type="button" className="btn-save" onClick={handleSaveConfig} disabled={!isConfigChanged}>Lưu cấu hình</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;