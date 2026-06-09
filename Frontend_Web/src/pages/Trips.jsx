import { useState, useMemo } from 'react';
import TripsToolbar from '../components/trips/TripsToolbar';
import TripsFilter from '../components/trips/TripsFilter';
import TripsTable from '../components/trips/TripsTable';
import AddTripModal from '../components/trips/AddTripModal';
import '../styles/trips.css';

// Mock data for demonstration
const MOCK_TRIPS = [
  { id: 1, code: 'HT-1024', route: 'Sài Gòn - Đà Lạt', departure: '08:00 - 15/05/2026', vehicleType: 'Limousine 34', driver: 'Nguyễn Văn A', status: 'upcoming' },
  { id: 2, code: 'HT-1025', route: 'Đà Lạt - Sài Gòn', departure: '09:00 - 15/05/2026', vehicleType: 'Giường nằm 40', driver: 'Trần Văn B', status: 'running' },
  { id: 3, code: 'HT-1026', route: 'Sài Gòn - Nha Trang', departure: '10:30 - 15/05/2026', vehicleType: 'Limousine 34', driver: 'Lê Văn C', status: 'completed' },
  { id: 4, code: 'HT-1027', route: 'Sài Gòn - Đà Lạt', departure: '12:00 - 15/05/2026', vehicleType: 'Phòng nằm 22', driver: 'Phạm Văn D', status: 'cancelled' },
  { id: 5, code: 'HT-1028', route: 'Đà Lạt - Sài Gòn', departure: '14:00 - 15/05/2026', vehicleType: 'Giường nằm 40', driver: 'Hoàng Văn E', status: 'upcoming' },
  { id: 6, code: 'HT-1029', route: 'Sài Gòn - Nha Trang', departure: '16:00 - 15/05/2026', vehicleType: 'Limousine 34', driver: 'Vũ Văn F', status: 'upcoming' },
  { id: 7, code: 'HT-1030', route: 'Sài Gòn - Đà Lạt', departure: '18:00 - 15/05/2026', vehicleType: 'Phòng nằm 22', driver: 'Bùi Văn G', status: 'upcoming' },
];

const Trips = () => {
  const [tripsData, setTripsData] = useState(MOCK_TRIPS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter logic
  const filteredTrips = useMemo(() => {
    return tripsData.filter((trip) => {
      // Text search (Code or Driver)
      const matchesSearch = 
        trip.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        trip.driver.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Route filter
      const matchesRoute = routeFilter === 'all' || trip.route === routeFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;

      return matchesSearch && matchesRoute && matchesStatus;
    });
  }, [searchTerm, routeFilter, statusFilter, tripsData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage) || 1;
  const paginatedTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTrips.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTrips, currentPage]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleRouteFilterChange = (val) => {
    setRouteFilter(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleSaveTrip = (newTripData) => {
    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formattedDate = newTripData.departureDate.split('-').reverse().join('/');
    const newTrip = {
      id: tripsData.length > 0 ? Math.max(...tripsData.map(t => t.id)) + 1 : 1,
      code: newTripData.code,
      route: newTripData.route,
      departure: `${newTripData.departureTime} - ${formattedDate}`,
      vehicleType: newTripData.vehicleType,
      driver: newTripData.driver,
      status: 'upcoming'
    };
    
    // Add new trip to the top of the list to preserve old data while showing the new one
    setTripsData(prev => [newTrip, ...prev]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="trips-page">
      <TripsToolbar onAddClick={() => setIsAddModalOpen(true)} />
      
      <TripsFilter 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        routeFilter={routeFilter}
        onRouteFilterChange={handleRouteFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <TripsTable 
        data={paginatedTrips}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddTripModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveTrip} 
      />
    </div>
  );
};

export default Trips;
