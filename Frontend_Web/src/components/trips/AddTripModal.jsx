import { useState } from 'react';
import { CloseIcon } from '../../assets/icons';

const AddTripModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    code: '',
    route: '',
    departureDate: '',
    departureTime: '',
    vehicleType: '',
    driver: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Reset form after saving
    setFormData({
      code: '',
      route: '',
      departureDate: '',
      departureTime: '',
      vehicleType: '',
      driver: ''
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Thêm chuyến xe mới</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <CloseIcon size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="code">Mã chuyến</label>
                <input 
                  type="text" 
                  id="code"
                  name="code"
                  className="form-control" 
                  placeholder="VD: HT-1031"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="route">Tuyến đường</label>
                <select 
                  id="route" 
                  name="route"
                  className="form-control"
                  value={formData.route}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn tuyến đường --</option>
                  <option value="Sài Gòn - Đà Lạt">Sài Gòn - Đà Lạt</option>
                  <option value="Đà Lạt - Sài Gòn">Đà Lạt - Sài Gòn</option>
                  <option value="Sài Gòn - Nha Trang">Sài Gòn - Nha Trang</option>
                  <option value="Nha Trang - Sài Gòn">Nha Trang - Sài Gòn</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departureDate">Ngày khởi hành</label>
                <input 
                  type="date" 
                  id="departureDate" 
                  name="departureDate"
                  className="form-control"
                  value={formData.departureDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="departureTime">Giờ khởi hành</label>
                <input 
                  type="time" 
                  id="departureTime" 
                  name="departureTime"
                  className="form-control"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="vehicleType">Loại xe</label>
                <select 
                  id="vehicleType" 
                  name="vehicleType"
                  className="form-control"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn loại xe --</option>
                  <option value="Giường nằm 40">Giường nằm 40 chỗ</option>
                  <option value="Limousine 34">Limousine 34 phòng</option>
                  <option value="Phòng nằm 22">Phòng nằm 22 cabin</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="driver">Tài xế phụ trách</label>
                <input 
                  type="text" 
                  id="driver" 
                  name="driver"
                  className="form-control"
                  placeholder="Nhập tên tài xế"
                  value={formData.driver}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn--outline" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn btn--primary">
              Lưu chuyến xe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTripModal;
