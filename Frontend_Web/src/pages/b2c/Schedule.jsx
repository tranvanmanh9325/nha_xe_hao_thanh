import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/authService';
import { fetchSettings } from '../../utils/settingsService';
import GuestNavbar from '../../components/b2c/GuestNavbar';
import GuestFooter from '../../components/b2c/GuestFooter';
import AuthModal from '../../components/b2c/AuthModal';
import { DateIcon, LocationIcon, BusIcon } from '../../components/icons/CustomIcons';

const Schedule = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, tripsResponse] = await Promise.all([
          fetchSettings().catch(() => null),
          fetch(`${API_BASE_URL}/api/v1/trips`)
        ]);

        if (settingsData) setSettings(settingsData);

        if (tripsResponse.ok) {
          const tripsData = await tripsResponse.json();
          const dataArray = Array.isArray(tripsData) ? tripsData : (tripsData.success ? tripsData.data : []);
          if (dataArray && dataArray.length > 0) {
            // Filter scheduled trips
            const scheduledTrips = dataArray.filter(t => t.status === 'SCHEDULED');
            setTrips(scheduledTrips);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Group trips by route
  const routesMap = trips.reduce((acc, trip) => {
    const routeId = typeof trip.route === 'string' ? trip.route : (trip.route?._id || trip.route?.startPoint);
    if (!routeId) return acc;

    if (!acc[routeId]) {
      const isStringRoute = typeof trip.route === 'string' && trip.route.includes(' - ');
      const startPoint = isStringRoute ? trip.route.split(' - ')[0] : (trip.route?.startPoint || '');
      const endPoint = isStringRoute ? trip.route.split(' - ')[1] : (trip.route?.endPoint || '');

      acc[routeId] = {
        routeInfo: {
          _id: routeId,
          startPoint,
          endPoint,
          distance: trip.route?.distance,
          duration: trip.route?.duration,
        },
        trips: [],
        minPrice: trip.basePrice || trip.price || 0,
        busTypes: new Set()
      };
    }
    acc[routeId].trips.push(trip);
    const price = trip.basePrice || trip.price || 0;
    if (price > 0 && price < acc[routeId].minPrice) {
      acc[routeId].minPrice = price;
    }
    if (trip.bus?.type) {
      acc[routeId].busTypes.add(trip.bus.type);
    }
    return acc;
  }, {});

  const groupedRoutes = Object.values(routesMap);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getBusTypeName = (type) => {
    const types = {
      'LIMOUSINE': 'Limousine',
      'SLEEPER': 'Giường nằm',
      'SEATER': 'Ghế ngồi'
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex flex-col">
      <GuestNavbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 drop-shadow-sm">
              Lịch trình chuyến đi
            </h1>
            <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
              Khám phá các tuyến đường đang được Hào Thanh khai thác. Chọn hành trình phù hợp với bạn ngay hôm nay.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : groupedRoutes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-neutral-100">
              <BusIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-xl text-neutral-500 font-medium">Hiện tại chưa có chuyến xe nào được lên lịch.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedRoutes.map((group) => {
                const route = group.routeInfo;
                // Sort trips by departure time
                const sortedTrips = group.trips.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
                const busTypesStr = Array.from(group.busTypes).map(getBusTypeName).join(' / ');

                return (
                  <div key={route._id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 flex flex-col group">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-brand-600 transition-colors mb-2 line-clamp-2">
                        {route.startPoint} <span className="text-neutral-400 mx-1">→</span> {route.endPoint}
                      </h3>
                      
                      <div className="flex items-center text-neutral-500 text-sm space-x-4">
                        <div className="flex items-center">
                          <LocationIcon className="w-4 h-4 mr-1 text-brand-500" />
                          <span>{route.distance || '---'} km</span>
                        </div>
                        <div className="flex items-center">
                          <DateIcon className="w-4 h-4 mr-1 text-brand-500" />
                          <span>{route.duration || '---'} giờ</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 flex-grow border-t border-neutral-100 pt-4">
                      <div>
                        <p className="text-sm font-semibold text-neutral-700 mb-2">Các giờ xuất bến:</p>
                        <div className="flex flex-wrap gap-2">
                          {sortedTrips.map(trip => (
                            <span key={trip._id} className="px-3 py-1 bg-brand-50 text-brand-700 font-medium text-sm rounded-lg border border-brand-100">
                              {formatTime(trip.departureTime)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-neutral-50 rounded-xl p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-500">Loại xe:</span>
                          <span className="text-sm font-medium text-neutral-800">{busTypesStr || 'Giường nằm cao cấp'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-500">Giá vé từ:</span>
                          <span className="text-lg font-bold text-brand-600">{formatCurrency(group.minPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigate('/')}
                      className="mt-6 w-full py-3 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white font-semibold rounded-xl transition-colors border border-brand-100 hover:border-brand-500 flex justify-center items-center group/btn"
                    >
                      Tìm vé tuyến này
                      <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <GuestFooter settings={settings} />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Schedule;