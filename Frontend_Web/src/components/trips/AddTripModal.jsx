import { useState } from 'react';
import { CloseIcon } from '../../assets/icons';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import TimePicker from '../ui/TimePicker';

const AddTripModal = ({ isOpen, onClose, onSave, routes = [], buses = [] }) => {
  const [formData, setFormData] = useState({
    code: '',
    route: '',
    departureDate: '',
    departureTime: '',
    busNumber: '',
    licensePlate: '',
    driver: ''
  });

  const routeOptions = [
    { value: '', label: '-- Chọn tuyến đường --' },
    ...routes.map(r => ({
      value: `${r.origin} - ${r.destination}`,
      label: `${r.origin} - ${r.destination}`
    }))
  ];

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'busNumber') {
      const selectedBus = buses.find(b => b.busNumber === value);
      setFormData(prev => ({
        ...prev,
        busNumber: value,
        licensePlate: selectedBus ? selectedBus.licensePlate : ''
      }));
    } else if (name === 'licensePlate') {
      const selectedBus = buses.find(b => b.licensePlate === value);
      setFormData(prev => ({
        ...prev,
        licensePlate: value,
        busNumber: selectedBus ? selectedBus.busNumber : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
      busNumber: '',
      licensePlate: '',
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
                <Select 
                  value={formData.route}
                  onChange={(val) => handleChange({ target: { name: 'route', value: val } })}
                  options={routeOptions}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="departureDate">Ngày khởi hành</label>
                <DatePicker 
                  value={formData.departureDate}
                  onChange={(val) => handleChange({ target: { name: 'departureDate', value: val } })}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="departureTime">Giờ khởi hành</label>
                <TimePicker 
                  value={formData.departureTime}
                  onChange={(val) => handleChange({ target: { name: 'departureTime', value: val } })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="busNumber">Số xe</label>
                <Select 
                  value={formData.busNumber}
                  onChange={(val) => handleChange({ target: { name: 'busNumber', value: val } })}
                  options={[
                    { value: '', label: '-- Chọn số xe --' },
                    ...(buses || []).map(b => ({ value: b.busNumber, label: b.busNumber }))
                  ]}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="licensePlate">Biển số xe</label>
                <Select 
                  value={formData.licensePlate}
                  onChange={(val) => handleChange({ target: { name: 'licensePlate', value: val } })}
                  options={[
                    { value: '', label: '-- Chọn biển số xe --' },
                    ...(buses || []).map(b => ({ value: b.licensePlate, label: b.licensePlate }))
                  ]}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            
            <div className="form-row">
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
              <div className="form-group"></div>
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