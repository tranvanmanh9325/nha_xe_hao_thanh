import { useState, useMemo, useEffect } from 'react';
import TripsToolbar from '../components/trips/TripsToolbar';
import TripsFilter from '../components/trips/TripsFilter';
import TripsTable from '../components/trips/TripsTable';
import AddTripModal from '../components/trips/AddTripModal';
import { authFetch } from '../utils/authService';
import '../styles/trips.css';

const Trips = () => {
  const [tripsData, setTripsData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch trips data and routes from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [tripsResponse, routesResponse, busesResponse] = await Promise.all([
          authFetch('http://localhost:8080/api/v1/trips'),
          authFetch('http://localhost:8080/api/v1/routes'),
          authFetch('http://localhost:8080/api/v1/buses')
        ]);

        if (!tripsResponse.ok) {
          throw new Error('Không thể tải dữ liệu chuyến xe từ máy chủ.');
        }
        
        const tripsData = await tripsResponse.json();
        setTripsData(tripsData);

        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          setRoutes(routesData);
        }
        
        if (busesResponse.ok) {
          const busesData = await busesResponse.json();
          setBuses(busesData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter logic
  const filteredTrips = useMemo(() => {
    return tripsData.filter((trip) => {
      // Text search (ID or License Plate)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        trip.id?.toString().toLowerCase().includes(searchLower) || 
        (trip.licensePlate && trip.licensePlate.toLowerCase().includes(searchLower));
      
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
      licensePlate: newTripData.licensePlate,
      busNumber: newTripData.busNumber,
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
        routes={routes}
      />

      <TripsTable 
        data={paginatedTrips}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddTripModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveTrip} 
        routes={routes}
        buses={buses}
      />
    </div>
  );
};

export default Trips;
