import { useState } from 'react';

const AddBusModal = ({ isOpen, onClose, onBusAdded }) => {
  const [formData, setFormData] = useState({
    licensePlate: '',
    busType: 'Limousine 34 Phòng',
    totalSeats: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!formData.licensePlate || !formData.totalSeats) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/buses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          totalSeats: parseInt(formData.totalSeats, 10)
        }),
      });

      if (!response.ok) {
        // Since we are throwing RuntimeException in backend, it might not return JSON, 
        // or returns default Spring error JSON
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.message || 'Lỗi khi thêm xe. Biển số xe có thể đã tồn tại.');
      }

      setFormData({ licensePlate: '', busType: 'Limousine 34 Phòng', totalSeats: '' });
      if (onBusAdded) onBusAdded();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Backdrop/overlay
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000 // Ensure modal is on top
    }}>
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        width: '400px',
        maxWidth: '90%',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: 'var(--space-4)', color: 'var(--neutral-900)' }}>
          Thêm xe mới
        </h2>
        
        {error && (
          <div style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-2) var(--space-3)', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', marginBottom: 'var(--space-2)' }}>
            Biển số xe
          </label>
          <input 
            type="text" 
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            placeholder="Nhập biển số xe"
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
          />
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', marginBottom: 'var(--space-2)' }}>
            Loại xe
          </label>
          <select 
            name="busType"
            value={formData.busType}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              backgroundColor: 'white',
              outline: 'none',
              cursor: 'pointer'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
          >
            <option value="Limousine 34 Phòng">Limousine 34 Phòng</option>
            <option value="Giường Nằm 40">Giường Nằm 40</option>
          </select>
        </div>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: '500', marginBottom: 'var(--space-2)' }}>
            Tổng số ghế
          </label>
          <input 
            type="number" 
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            placeholder="Nhập tổng số ghế"
            style={{
              width: '100%',
              padding: 'var(--space-2) var(--space-3)',
              border: '1px solid var(--neutral-300)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-base)',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--neutral-300)'}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
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

export default AddBusModal;
