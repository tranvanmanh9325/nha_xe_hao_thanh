const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy', 
  type = 'danger' 
}) => {
  if (!isOpen) return null;

  const isDanger = type === 'danger';

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
        width: '400px',
        maxWidth: '95%',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h3 style={{ 
          fontSize: 'var(--text-lg)', 
          fontWeight: '600', 
          marginBottom: 'var(--space-2)', 
          color: 'var(--neutral-900)' 
        }}>
          {title}
        </h3>
        
        <p style={{ 
          color: 'var(--neutral-600)', 
          fontSize: 'var(--text-base)', 
          marginBottom: 'var(--space-6)',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 'var(--space-3)'
        }}>
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
            {cancelText}
          </button>
          
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: isDanger ? '#ef4444' : 'var(--brand-500)',
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDanger ? '#dc2626' : 'var(--brand-600)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isDanger ? '#ef4444' : 'var(--brand-500)'}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;