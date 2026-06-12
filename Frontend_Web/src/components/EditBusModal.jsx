import { useState, useRef } from 'react';
import ImageCropperModal from './ImageCropperModal';

const EditBusModal = ({ isOpen, onClose, onBusUpdated, busInfo }) => {
  const [formData, setFormData] = useState({
    licensePlate: busInfo?.licensePlate || '',
    busType: busInfo?.busType || '',
    totalSeats: busInfo?.totalSeats || '',
    description: busInfo?.description || '',
    manufactureYear: busInfo?.manufactureYear || '',
    color: busInfo?.color || '',
    image: null,
    imagePreview: busInfo?.imageUrl || null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Cropper states
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImageSrc(reader.result);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropComplete = (croppedFile) => {
    setFormData(prev => ({
      ...prev,
      image: croppedFile,
      imagePreview: URL.createObjectURL(croppedFile)
    }));
    setIsCropperOpen(false);
    setTempImageSrc(null);
  };

  const handleSave = async () => {
    if (!formData.licensePlate || !formData.totalSeats) {
      setError('Vui lòng điền biển số xe và tổng số ghế');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('licensePlate', formData.licensePlate);
      formDataObj.append('busType', formData.busType);
      formDataObj.append('totalSeats', formData.totalSeats);
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      if (formData.description) formDataObj.append('description', formData.description);
      if (formData.manufactureYear) formDataObj.append('manufactureYear', formData.manufactureYear);
      if (formData.color) formDataObj.append('color', formData.color);

      const response = await fetch(`http://localhost:8080/api/v1/buses/${busInfo.id}`, {
        method: 'PUT',
        // Do NOT set Content-Type header when sending FormData, 
        // the browser will automatically set it with boundary
        body: formDataObj,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Lỗi khi cập nhật thông tin xe.');
      }

      if (onBusUpdated) onBusUpdated();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-2) var(--space-3)',
    border: '1px solid var(--neutral-300)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    transition: 'border-color var(--transition-fast)'
  };

  const labelStyle = { display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', marginBottom: 'var(--space-2)' };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        width: '800px',
        maxWidth: '95%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: 'var(--space-4)', color: 'var(--neutral-900)' }}>
          Cập nhật thông tin xe
        </h2>
        
        {error && (
          <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-2) var(--space-3)', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
          {/* Cột trái: Image Upload */}
          <div style={{ width: '250px', flexShrink: 0 }}>
            <label style={labelStyle}>Ảnh thực tế</label>
            <div 
              style={{
                width: '100%',
                height: '250px',
                border: '2px dashed var(--neutral-300)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: 'var(--neutral-50)',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('busImageUpload').click()}
            >
              {formData.imagePreview ? (
                <img src={formData.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: 'var(--neutral-500)', fontSize: 'var(--text-sm)' }}>Nhấn để chọn ảnh mới</span>
              )}
              <input 
                id="busImageUpload"
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          {/* Cột phải: Form nhập liệu */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={labelStyle}>Biển số xe *</label>
                <input 
                  type="text" name="licensePlate" value={formData.licensePlate} onChange={handleChange}
                  placeholder="VD: 51B-123.45" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Loại xe</label>
                <input 
                  type="text" name="busType" value={formData.busType} onChange={handleChange}
                  placeholder="VD: Thaco Mobihome 34 chỗ" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div>
                <label style={labelStyle}>Tổng số ghế *</label>
                <input 
                  type="number" name="totalSeats" value={formData.totalSeats} onChange={handleChange}
                  placeholder="VD: 34" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Màu sắc</label>
                <input 
                  type="text" name="color" value={formData.color} onChange={handleChange}
                  placeholder="VD: Trắng" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                />
              </div>
              <div>
                <label style={labelStyle}>Năm sản xuất</label>
                <input 
                  type="number" name="manufactureYear" value={formData.manufactureYear} onChange={handleChange}
                  placeholder="VD: 2022" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label style={labelStyle}>Mô tả chi tiết</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange}
                placeholder="Nhập mô tả về xe (tiện ích, tình trạng...)" 
                style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)', borderTop: '1px solid var(--neutral-200)', paddingTop: 'var(--space-4)' }}>
          <button 
            onClick={onClose}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--neutral-300)',
              backgroundColor: 'white',
              color: 'var(--neutral-700)',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--neutral-100)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            disabled={isSubmitting}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: isSubmitting ? 'var(--neutral-400)' : 'var(--brand-500)',
              color: 'white',
              fontWeight: '500',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--brand-600)'; }}
            onMouseLeave={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = 'var(--brand-500)'; }}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
      
      {/* Modal cắt ảnh */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={tempImageSrc}
        onClose={() => {
          setIsCropperOpen(false);
          setTempImageSrc(null);
        }}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default EditBusModal;
