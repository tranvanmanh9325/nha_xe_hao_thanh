import { useState } from 'react';
import { authFetch } from '../utils/authService';

const RouteFormModal = ({ isOpen, onClose, onSaved, initialData }) => {
  const [formData, setFormData] = useState({
    routeCode: initialData?.routeCode || '',
    origin: initialData?.origin || '',
    destination: initialData?.destination || '',
    distance: initialData?.distance || '',
    estimatedDuration: initialData?.estimatedDuration || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.routeCode || !formData.origin || !formData.destination) {
      setError('Vui lòng điền mã tuyến, điểm khởi hành và điểm đến');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const isEdit = !!initialData;
      const url = isEdit 
        ? `http://localhost:8080/api/v1/routes/${initialData.id}` 
        : 'http://localhost:8080/api/v1/routes';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await authFetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          distance: formData.distance ? parseFloat(formData.distance) : null,
          estimatedDuration: formData.estimatedDuration ? parseFloat(formData.estimatedDuration) : null
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Lỗi khi lưu tuyến đường. Mã tuyến có thể đã tồn tại.');
      }

      setFormData({ routeCode: '', origin: '', destination: '', distance: '', estimatedDuration: '' });
      if (onSaved) onSaved();
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
        width: '600px',
        maxWidth: '95%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: 'var(--space-4)', color: 'var(--neutral-900)' }}>
          {initialData ? 'Sửa tuyến đường' : 'Thêm tuyến đường mới'}
        </h2>
        
        {error && (
          <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-2) var(--space-3)', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
            {error}
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Mã tuyến *</label>
            <input 
              type="text" name="routeCode" value={formData.routeCode} onChange={handleChange}
              placeholder="VD: HN-DL" style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Điểm khởi hành *</label>
            <input 
              type="text" name="origin" value={formData.origin} onChange={handleChange}
              placeholder="VD: Hà Nội" style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Điểm đến *</label>
            <input 
              type="text" name="destination" value={formData.destination} onChange={handleChange}
              placeholder="VD: Đà Lạt" style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Quãng đường (km)</label>
            <input 
              type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange}
              placeholder="VD: 1500" style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Thời gian dự kiến (giờ)</label>
            <input 
              type="number" step="0.1" name="estimatedDuration" value={formData.estimatedDuration} onChange={handleChange}
              placeholder="VD: 24.5" style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
            />
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
    </div>
  );
};

export default RouteFormModal;
