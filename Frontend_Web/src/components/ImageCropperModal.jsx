import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw } from 'lucide-react';
import getCroppedImg from '../utils/cropImage';

const ImageCropperModal = ({ isOpen, imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      // Tạo một File object từ Blob để giống với hành vi của input file
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi cắt ảnh!');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const controlStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    width: '100%'
  };

  const labelStyle = {
    fontSize: 'var(--text-sm)',
    fontWeight: '500',
    color: 'var(--neutral-700)',
    minWidth: '60px'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div style={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        width: '600px',
        maxWidth: '95%',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: '600', marginBottom: 'var(--space-4)', color: 'var(--neutral-900)' }}>
          Chỉnh sửa ảnh
        </h2>

        {/* Khung chứa ảnh để crop */}
        <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#333', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--space-4)' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={16 / 9} // Tỷ lệ ảnh xe thường là 16:9
            onCropChange={setCrop}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        {/* Các control điều chỉnh */}
        <div style={{ padding: '0 var(--space-2)' }}>
          <div style={controlStyle}>
            <label style={labelStyle}>Thu phóng</label>
            <ZoomOut size={18} color="var(--neutral-500)" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--brand-500)' }}
            />
            <ZoomIn size={18} color="var(--neutral-500)" />
          </div>

          <div style={controlStyle}>
            <label style={labelStyle}>Xoay</label>
            <RotateCcw size={18} color="var(--neutral-500)" cursor="pointer" onClick={() => setRotation(r => r - 90)} />
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--brand-500)' }}
            />
            <RotateCw size={18} color="var(--neutral-500)" cursor="pointer" onClick={() => setRotation(r => r + 90)} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)', borderTop: '1px solid var(--neutral-200)', paddingTop: 'var(--space-4)' }}>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--neutral-300)',
              backgroundColor: 'white',
              color: 'var(--neutral-700)',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.backgroundColor = 'var(--neutral-100)'; }}
            onMouseLeave={(e) => { if (!isProcessing) e.currentTarget.style.backgroundColor = 'white'; }}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              backgroundColor: isProcessing ? 'var(--neutral-400)' : 'var(--brand-500)',
              color: 'white',
              fontWeight: '500',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.backgroundColor = 'var(--brand-600)'; }}
            onMouseLeave={(e) => { if (!isProcessing) e.currentTarget.style.backgroundColor = 'var(--brand-500)'; }}
          >
            {isProcessing ? 'Đang xử lý...' : 'Xác nhận cắt'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
