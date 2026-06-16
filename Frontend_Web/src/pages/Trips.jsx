import { useState, useMemo, useEffect } from 'react';
import TripsToolbar from '../components/trips/TripsToolbar';
import TripsFilter from '../components/trips/TripsFilter';
import TripsTable from '../components/trips/TripsTable';
import AddTripModal from '../components/trips/AddTripModal';
import EditTripModal from '../components/trips/EditTripModal';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';
import ConfirmCancelModal from '../components/ui/ConfirmCancelModal';
import AdminBookingModal from '../components/trips/AdminBookingModal';
import { authFetch } from '../utils/authService';
import { toast } from 'react-toastify';
import '../styles/trips.css';

const Trips = () => {
  const [tripsData, setTripsData] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [deletingTrip, setDeletingTrip] = useState(null);
  const [cancellingTrip, setCancellingTrip] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [bookingTrip, setBookingTrip] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [routeFilter, setRouteFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('today');
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

  // Helper for date filter
  const isDateMatches = (departureTime, filterValue) => {
    if (filterValue === 'all') return true;
    if (!departureTime) return false;
    
    const depDate = new Date(departureTime);
    if (isNaN(depDate)) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const depDateOnly = new Date(depDate);
    depDateOnly.setHours(0, 0, 0, 0);

    if (filterValue === 'today') {
      return depDateOnly.getTime() === today.getTime();
    } else if (filterValue === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return depDateOnly.getTime() === tomorrow.getTime();
    } else if (filterValue === 'this_week') {
      const firstDayOfWeek = new Date(today);
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      firstDayOfWeek.setDate(diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);
      
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);
      
      return depDate >= firstDayOfWeek && depDate <= lastDayOfWeek;
    }
    return true;
  };

  // Filter logic
  const filteredTrips = useMemo(() => {
    return tripsData.filter((trip) => {
      // Text search (ID or License Plate)
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        trip.id?.toString().toLowerCase().includes(searchLower) || 
        (trip.licensePlate && trip.licensePlate.toLowerCase().includes(searchLower));
      
      // Route filter
      const tripRouteStr = typeof trip.route === 'object' ? `${trip.route.origin} - ${trip.route.destination}` : trip.route;
      const matchesRoute = routeFilter === 'all' || tripRouteStr === routeFilter;
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;

      // Time filter
      const matchesTime = isDateMatches(trip.departureTime, timeFilter);

      return matchesSearch && matchesRoute && matchesStatus && matchesTime;
    });
  }, [searchTerm, routeFilter, statusFilter, timeFilter, tripsData]);

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

  const handleTimeFilterChange = (val) => {
    setTimeFilter(val);
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

  const handleEditSave = (updatedTripData) => {
    let updatedTrip = { ...updatedTripData };
    if (updatedTripData.departureDate && updatedTripData.departureTime) {
      const formattedDate = updatedTripData.departureDate.split('-').reverse().join('/');
      updatedTrip.departure = `${updatedTripData.departureTime} - ${formattedDate}`;
    }
    setTripsData(prev => prev.map(t => t.id === updatedTrip.id ? { ...t, ...updatedTrip } : t));
    setEditingTrip(null);
  };

  const handleDelete = (trip) => {
    setDeletingTrip(trip);
  };

  const handleCancel = (trip) => {
    setCancellingTrip(trip);
  };

  const confirmCancel = async () => {
    if (!cancellingTrip) return;
    setIsCancelling(true);
    try {
      const response = await authFetch(`http://localhost:8080/api/v1/trips/${cancellingTrip.id}/cancel`, {
        method: 'PATCH'
      });
      if (!response.ok) {
        throw new Error('Có lỗi xảy ra khi hủy chuyến');
      }
      toast.success('Hủy chuyến thành công!');
      setTripsData(prev => prev.map(t => t.id === cancellingTrip.id ? { ...t, status: 'CANCELLED' } : t));
    } catch (err) {
      toast.error(err.message || 'Có lỗi xảy ra khi hủy chuyến');
    } finally {
      setIsCancelling(false);
      setCancellingTrip(null);
    }
  };

  const confirmDelete = () => {
    if (deletingTrip) {
      // Assuming a frontend mock deletion
      setTripsData(prev => prev.filter(t => t.id !== deletingTrip.id));
      setDeletingTrip(null);
    }
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
        timeFilter={timeFilter}
        onTimeFilterChange={handleTimeFilterChange}
        routes={routes}
      />

      <TripsTable 
        data={paginatedTrips}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={(trip) => setEditingTrip(trip)}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onBookTicket={(trip) => setBookingTrip(trip)}
      />

      <AddTripModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleSaveTrip} 
        routes={routes}
        buses={buses}
      />

      <EditTripModal 
        key={editingTrip ? editingTrip.id : 'empty'}
        isOpen={!!editingTrip} 
        onClose={() => setEditingTrip(null)} 
        onSave={handleEditSave} 
        trip={editingTrip}
        routes={routes}
        buses={buses}
      />

      <ConfirmDeleteModal
        isOpen={!!deletingTrip}
        onClose={() => setDeletingTrip(null)}
        onConfirm={confirmDelete}
        trip={deletingTrip}
      />

      <ConfirmCancelModal
        isOpen={!!cancellingTrip}
        onClose={() => setCancellingTrip(null)}
        onConfirm={confirmCancel}
        trip={cancellingTrip}
        isCancelling={isCancelling}
      />

      <AdminBookingModal
        key={bookingTrip ? bookingTrip.id : 'empty-pos'}
        isOpen={!!bookingTrip}
        onClose={() => setBookingTrip(null)}
        trip={bookingTrip}
        onSuccess={() => setBookingTrip(null)}
      />
    </div>
  );
};

export default Trips;