import { useState, useEffect } from 'react';
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
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Helper for date filter API params
  const getDatesFromFilter = (filterValue) => {
    if (filterValue === 'all') return { startDate: null, endDate: null };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatToOffset = (date) => {
      // Create a string that can be parsed by OffsetDateTime, e.g. "2026-06-18T00:00:00+07:00"
      // Wait, simple toISOString() uses Z, which is fine for OffsetDateTime
      return date.toISOString();
    };

    if (filterValue === 'today') {
      const end = new Date(today);
      end.setHours(23, 59, 59, 999);
      return { startDate: formatToOffset(today), endDate: formatToOffset(end) };
    } else if (filterValue === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const end = new Date(tomorrow);
      end.setHours(23, 59, 59, 999);
      return { startDate: formatToOffset(tomorrow), endDate: formatToOffset(end) };
    } else if (filterValue === 'this_week') {
      const firstDayOfWeek = new Date(today);
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      firstDayOfWeek.setDate(diff);
      
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);
      
      return { startDate: formatToOffset(firstDayOfWeek), endDate: formatToOffset(lastDayOfWeek) };
    }
    return { startDate: null, endDate: null };
  };

  // 1. Fetch lookups once
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [routesResponse, busesResponse] = await Promise.all([
          authFetch('http://localhost:8080/api/v1/routes'),
          authFetch('http://localhost:8080/api/v1/buses')
        ]);
        if (routesResponse.ok) setRoutes(await routesResponse.json());
        if (busesResponse.ok) setBuses(await busesResponse.json());
      } catch (err) {
        console.error("Error fetching lookups", err);
      }
    };
    fetchLookups();
  }, []);

  // 2. Fetch trips when filters/pagination change
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        params.append('page', currentPage - 1); // Spring Data page is 0-indexed
        params.append('size', itemsPerPage);
        
        if (routeFilter !== 'all') params.append('route', routeFilter);
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (searchTerm) params.append('searchTerm', searchTerm);
        
        const dates = getDatesFromFilter(timeFilter);
        if (dates.startDate) params.append('startDate', dates.startDate);
        if (dates.endDate) params.append('endDate', dates.endDate);

        const response = await authFetch(`http://localhost:8080/api/v1/trips?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu chuyến xe từ máy chủ.');
        }
        
        const data = await response.json();
        setTripsData(data.content || []);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.totalElements || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => fetchTrips(), 300);
    return () => clearTimeout(timeoutId);
  }, [currentPage, itemsPerPage, searchTerm, routeFilter, statusFilter, timeFilter]);

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
        data={tripsData}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
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