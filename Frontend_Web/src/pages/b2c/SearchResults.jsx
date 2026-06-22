import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/authService';
import { fetchSettings } from '../../utils/settingsService';
import GuestNavbar from '../../components/b2c/GuestNavbar';
import GuestFooter from '../../components/b2c/GuestFooter';
import AuthModal from '../../components/b2c/AuthModal';
import { DateIcon, SearchIcon } from '../../components/icons/CustomIcons';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const formatDateVN = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  const dateStr = searchParams.get('date');

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    if (!from || !to || !dateStr) {
      navigate('/');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [settingsData, tripsResponse] = await Promise.all([
          fetchSettings().catch(() => null),
          fetch(`${API_BASE_URL}/api/v1/trips`)
        ]);

        if (settingsData) setSettings(settingsData);

        if (tripsResponse.ok) {
          const tripsData = await tripsResponse.json();
          const dataArray = Array.isArray(tripsData) ? tripsData : (tripsData.success ? tripsData.data : []);
          
          if (dataArray) {
            // Filter trips
            const filteredTrips = dataArray.filter(trip => {
              if (trip.status !== 'SCHEDULED') return false;
              
              const expectedRoute = `${from} - ${to}`;
              if (trip.route !== expectedRoute) return false;
              
              const tripDate = new Date(trip.departureTime);
              const tripYear = tripDate.getFullYear();
              const tripMonth = String(tripDate.getMonth() + 1).padStart(2, '0');
              const tripDay = String(tripDate.getDate()).padStart(2, '0');
              const formattedTripDate = `${tripYear}-${tripMonth}-${tripDay}`;
              
              return formattedTripDate === dateStr;
            });
            
            // Sort by departure time
            filteredTrips.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
            
            setTrips(filteredTrips);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [from, to, dateStr, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-white font-sans text-neutral-900 flex flex-col animate-fade-in">
      <GuestNavbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />

      <main className="flex-grow pt-20 pb-20">
        {/* Search Header */}
        <div className="bg-brand-600 py-8 mb-10 shadow-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="text-white">
                <p className="text-brand-100 font-medium mb-1">Kết quả tìm kiếm</p>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center flex-wrap gap-2">
                  <span>{from}</span>
                  <svg className="w-5 h-5 mx-1 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  <span>{to}</span>
                </h1>
                <div className="flex items-center mt-3 text-brand-50 text-sm font-medium">
                  <DateIcon className="w-4 h-4 mr-1.5" />
                  Ngày {formatDateVN(dateStr)}
                </div>
              </div>
              <button 
                onClick={() => navigate('/')}
                className="self-start md:self-center px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-brand-600 border border-white/30 rounded-xl font-semibold transition-all backdrop-blur-sm"
              >
                Đổi tìm kiếm
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-500 border-t-transparent"></div>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-neutral-100 px-4">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Không tìm thấy chuyến xe</h3>
              <p className="text-neutral-500 max-w-md mx-auto mb-8">
                Rất tiếc, không tìm thấy chuyến xe nào phù hợp với tuyến đường và ngày đi bạn chọn. Vui lòng thử chọn ngày khác hoặc tuyến đường khác.
              </p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-brand-50 text-brand-600 font-bold rounded-xl hover:bg-brand-100 transition-colors"
              >
                Tìm chuyến khác
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {trips.map(trip => {
                const busInfo = trip.busNumber ? `Xe số ${trip.busNumber}` : 'Xe khách';
                
                const depTime = new Date(trip.departureTime);
                const arrTime = new Date(trip.arrivalTime || new Date().getTime());
                
                let estimatedArrTimeStr;
                if (trip.arrivalTime && !isNaN(arrTime.getTime())) {
                  estimatedArrTimeStr = formatTime(trip.arrivalTime);
                } else {
                  // Assume 5 hours duration if missing
                  const estTime = new Date(depTime.getTime() + 5 * 60 * 60 * 1000);
                  estimatedArrTimeStr = formatTime(estTime);
                }

                return (
                  <div key={trip._id} className="animate-slide-up bg-white/80 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-lg transition-all border border-white/50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Left: Time & Route */}
                      <div className="flex-1">
                        <div className="flex items-start md:items-center space-x-4 mb-4 md:mb-0">
                          {/* Departure */}
                          <div className="text-center md:text-left min-w-[80px]">
                            <p className="text-2xl font-bold text-neutral-900">{formatTime(trip.departureTime)}</p>
                            <p className="text-sm font-medium text-neutral-500 mt-1">{from}</p>
                          </div>
                          
                          {/* Arrow/Line */}
                          <div className="flex-1 flex flex-col items-center justify-center px-4 relative mt-2 md:mt-0">
                            <span className="text-xs text-neutral-400 mb-1">{trip.route?.duration || '--'} giờ</span>
                            <div className="w-full h-[2px] bg-neutral-200 relative">
                              <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full border-2 border-brand-500 bg-white transform -translate-y-1/2 -ml-1"></div>
                              <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full border-2 border-brand-500 bg-brand-500 transform -translate-y-1/2 -mr-1"></div>
                            </div>
                          </div>
                          
                          {/* Arrival */}
                          <div className="text-center md:text-right min-w-[80px]">
                            <p className="text-2xl font-bold text-neutral-500">{estimatedArrTimeStr}</p>
                            <p className="text-sm font-medium text-neutral-500 mt-1">{to}</p>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Bus Info */}
                      <div className="md:border-l md:border-neutral-100 md:pl-6 flex-1">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-lg">
                            {busInfo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-emerald-600 font-semibold">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          <span>Biển số: {trip.licensePlate || 'Đang cập nhật'}</span>
                        </div>
                      </div>

                      {/* Right: Price & Action */}
                      <div className="md:border-l md:border-neutral-100 md:pl-6 flex flex-col items-end justify-center min-w-[150px]">
                        <div className="text-2xl font-black text-brand-600 mb-3">
                          {formatCurrency(trip.basePrice || trip.price || 0)}
                        </div>
                        <button className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl shadow-md shadow-brand-500/20 transition-all hover:shadow-brand-500/40 active:scale-[0.98]">
                          Chọn chỗ
                        </button>
                      </div>
                    </div>
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

export default SearchResults;