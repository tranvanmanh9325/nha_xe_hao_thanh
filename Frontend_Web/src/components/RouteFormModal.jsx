import { useState, useEffect } from 'react';
import { authFetch } from '../utils/authService';
import { toast } from 'react-toastify';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default leaflet marker icon not showing correctly in some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper component to auto-fit bounds when markers change
const MapBounds = ({ originCoords, destCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (originCoords && destCoords) {
      const bounds = L.latLngBounds([originCoords, destCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (originCoords) {
      map.setView(originCoords, 10);
    } else if (destCoords) {
      map.setView(destCoords, 10);
    }
  }, [originCoords, destCoords, map]);
  return null;
};

const handleGeocode = async (address, setCoordsFunc) => {
  if (!address) {
    setCoordsFunc(null);
    return;
  }
  try {
    // Sử dụng Photon API (dữ liệu mở, không cần API Key, không chứa domain openstreetmap)
    const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`);
    const data = await res.json();
    if (data && data.features && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates;
      // GeoJSON trả về [longitude, latitude], Leaflet cần [latitude, longitude]
      setCoordsFunc([coords[1], coords[0]]);
    } else {
      setCoordsFunc(null); // Not found
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
  }
};

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

  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routePath, setRoutePath] = useState(null);

  // Lưu trữ prop initialData và isOpen để reset state khi chúng thay đổi
  const [prevInitialData, setPrevInitialData] = useState(initialData);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevOriginCoords, setPrevOriginCoords] = useState(originCoords);
  const [prevDestCoords, setPrevDestCoords] = useState(destCoords);

  // Derive state during render: Cập nhật state ngay trong lúc render nếu props thay đổi
  if (initialData !== prevInitialData || isOpen !== prevIsOpen) {
    setPrevInitialData(initialData);
    setPrevIsOpen(isOpen);
    
    if (isOpen) {
      setFormData({
        routeCode: initialData?.routeCode || '',
        origin: initialData?.origin || '',
        destination: initialData?.destination || '',
        distance: initialData?.distance || '',
        estimatedDuration: initialData?.estimatedDuration || ''
      });
      setError(null);
      setOriginCoords(null);
      setDestCoords(null);
      setRoutePath(null);
    }
  }

  // Derive state cho routePath khi originCoords hoặc destCoords thay đổi
  if (originCoords !== prevOriginCoords || destCoords !== prevDestCoords) {
    setPrevOriginCoords(originCoords);
    setPrevDestCoords(destCoords);
    setRoutePath(null); // Xóa đường cũ ngay lập tức khi tọa độ bị đổi
  }

  // Lắng nghe khi có đủ 2 tọa độ thì gọi API vẽ đường (100% Async)
  useEffect(() => {
    let isMounted = true;
    if (originCoords && destCoords) {
      const fetchDrivingRoute = async () => {
        try {
          const OSRM_BASE_URL = import.meta.env.VITE_OSRM_API_URL || 'https://router.project-osrm.org';
          const url = `${OSRM_BASE_URL}/route/v1/driving/${originCoords[1]},${originCoords[0]};${destCoords[1]},${destCoords[0]}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          if (!res.ok) {
            throw new Error(`Routing API failed with status: ${res.status}`);
          }
          const data = await res.json();
          if (isMounted) {
            if (data && data.routes && data.routes.length > 0) {
              const route = data.routes[0];
              const coords = route.geometry.coordinates;
              const mappedCoordinates = coords.map(c => [c[1], c[0]]);
              setRoutePath(mappedCoordinates);
              
              // Tự động cập nhật quãng đường và thời gian dự kiến từ API OSRM
              if (route.distance !== undefined && route.duration !== undefined) {
                const distanceKm = (route.distance / 1000).toFixed(1);
                const durationHr = (route.duration / 3600).toFixed(1);
                setFormData(prev => ({
                  ...prev,
                  distance: distanceKm,
                  estimatedDuration: durationHr
                }));
              }
            } else {
              setRoutePath(null);
            }
          }
        } catch (err) {
          console.error("Routing failed:", err);
          if (isMounted) setRoutePath(null);
        }
      };
      
      fetchDrivingRoute();
    }
    return () => {
      isMounted = false;
    };
  }, [originCoords, destCoords]);

  // Gọi API (Async) an toàn trong useEffect, không có setState đồng bộ
  useEffect(() => {
    if (isOpen) {
      if (initialData?.origin) {
        handleGeocode(initialData.origin, setOriginCoords);
      }
      if (initialData?.destination) {
        handleGeocode(initialData.destination, setDestCoords);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field) => {
    if (field === 'origin' && formData.origin) {
      handleGeocode(formData.origin, setOriginCoords);
    } else if (field === 'destination' && formData.destination) {
      handleGeocode(formData.destination, setDestCoords);
    } else if (field === 'origin' && !formData.origin) {
      setOriginCoords(null);
    } else if (field === 'destination' && !formData.destination) {
      setDestCoords(null);
    }
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

      toast.success(isEdit ? 'Cập nhật tuyến đường thành công!' : 'Thêm tuyến đường mới thành công!');
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

  const hasChanges = !initialData || (
    formData.routeCode !== (initialData.routeCode || '') ||
    formData.origin !== (initialData.origin || '') ||
    formData.destination !== (initialData.destination || '') ||
    String(formData.distance || '') !== String(initialData.distance || '') ||
    String(formData.estimatedDuration || '') !== String(initialData.estimatedDuration || '')
  );

  const isFormValid = formData.routeCode?.trim() !== '' && formData.origin?.trim() !== '' && formData.destination?.trim() !== '';
  const isSaveDisabled = isSubmitting || !hasChanges || !isFormValid;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden">
        
        <div className="p-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Sửa tuyến đường' : 'Thêm tuyến đường mới'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cột trái: Form nhập liệu */}
            <div className="space-y-4">
              <div>
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
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--neutral-300)';
                    handleBlur('origin');
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ tự động tìm điểm trên bản đồ khi bạn nhập xong.</p>
              </div>

              <div>
                <label style={labelStyle}>Điểm đến *</label>
                <input 
                  type="text" name="destination" value={formData.destination} onChange={handleChange}
                  placeholder="VD: Đà Lạt" style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--brand-500)'}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--neutral-300)';
                    handleBlur('destination');
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">Hệ thống sẽ tự động tìm điểm trên bản đồ khi bạn nhập xong.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Cột phải: Bản đồ */}
            <div className="h-[400px] lg:h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-sm relative">
              <div className="absolute top-2 right-2 z-[400] bg-white px-3 py-1 rounded-md shadow-md text-sm font-medium text-gray-700 pointer-events-none">
                Bản đồ tuyến đường
              </div>
              <MapContainer 
                center={[16.047079, 108.206230]} // Trung tâm Việt Nam (Đà Nẵng)
                zoom={5} 
                style={{ height: '100%', width: '100%', zIndex: 1 }}
              >
                <TileLayer
                  attribution='&copy; Google Maps'
                  url="https://mt0.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}"
                />
                {originCoords && <Marker position={originCoords} icon={originIcon} />}
                {destCoords && <Marker position={destCoords} icon={destIcon} />}
                {routePath && (
                  <Polyline positions={routePath} color="#3b82f6" weight={4} opacity={0.7} />
                )}
                <MapBounds originCoords={originCoords} destCoords={destCoords} />
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="px-4 py-2 rounded-md border-none text-white font-medium transition-colors"
            style={{
              backgroundColor: isSaveDisabled ? 'var(--neutral-400)' : 'var(--brand-500)',
              cursor: isSaveDisabled ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => { if (!isSaveDisabled) e.currentTarget.style.backgroundColor = 'var(--brand-600)'; }}
            onMouseLeave={(e) => { if (!isSaveDisabled) e.currentTarget.style.backgroundColor = 'var(--brand-500)'; }}
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteFormModal;