import { useState, useEffect } from 'react';
import TicketsToolbar from '../components/tickets/TicketsToolbar';
import TicketsFilter from '../components/tickets/TicketsFilter';
import TicketsTable from '../components/tickets/TicketsTable';
import TicketDetailsModal from '../components/tickets/TicketDetailsModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { authFetch, API_BASE_URL } from '../utils/authService';
import '../styles/tickets.css';

const Tickets = () => {
  const [ticketsList, setTicketsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tripFilter, setTripFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [ticketToCancel, setTicketToCancel] = useState(null);
  
  const [totalPages, setTotalPages] = useState(1);
  const [uniqueTrips, setUniqueTrips] = useState([]);
  
  const itemsPerPage = 5;

  // Fetch trips for filter dropdown
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await authFetch(`${API_BASE_URL}/api/v1/trips?size=1000`);
        if (response.ok) {
          const data = await response.json();
          const trips = data.content || data;
          setUniqueTrips(trips.map(t => ({ value: t.id.toString(), label: `${t.id} (${t.route})` })));
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
      }
    };
    fetchTrips();
  }, []);

  // Fetch data from API
  const fetchTickets = async () => {
    try {
        setIsLoading(true);
        const params = new URLSearchParams({
          page: currentPage - 1,
          size: itemsPerPage
        });
        if (searchTerm) params.append('search', searchTerm);
        if (tripFilter !== 'all') params.append('tripId', tripFilter);
        if (statusFilter !== 'all') {
            // map frontend status to backend expected
            const statusToMatch = statusFilter === 'unpaid' ? 'pending' : statusFilter;
            params.append('status', statusToMatch);
        }
        if (dateFilter !== 'all') params.append('dateFilter', dateFilter);

        const response = await authFetch(`${API_BASE_URL}/api/v1/tickets?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Map backend DTO to frontend format. Handle Spring Data Page structure (data.content)
        const ticketList = data.content ? data.content : data;
        if (data.totalPages !== undefined) {
            setTotalPages(data.totalPages === 0 ? 1 : data.totalPages);
        }
        const formattedData = ticketList.map(t => {
          const dateObj = new Date(t.departureTime);
          const formattedDate = dateObj.toLocaleString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });

          let formattedBookingDate = 'Chưa xác định';
          if (t.createdAt) {
            const createdDateObj = new Date(t.createdAt);
            formattedBookingDate = createdDateObj.toLocaleString('vi-VN', {
              day: '2-digit', month: '2-digit', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            });
          }

          return {
            id: t.ticketCode,
            customerName: t.customerName,
            customerPhone: t.customerPhone,
            route: t.route,
            departureTime: formattedDate,
            bookingDate: formattedBookingDate,
            rawDate: t.createdAt,
            tripCode: t.tripId.toString(),
            seat: t.seatCode,
            price: t.totalPrice,
            status: t.paymentStatus.toLowerCase(),
            originalId: t.id
          };
        });

        setTicketsList(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Không thể tải dữ liệu vé. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [currentPage, searchTerm, tripFilter, statusFilter, dateFilter]);

  const handleUpdateSuccess = () => {
    fetchTickets();
  };


  const paginatedTickets = ticketsList;

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleTripFilterChange = (val) => {
    setTripFilter(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleDateFilterChange = (val) => {
    setDateFilter(val);
    setCurrentPage(1);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCancelTicket = (ticket) => {
    setTicketToCancel(ticket);
    setIsConfirmOpen(true);
  };

  const executeCancelTicket = async () => {
    if (!ticketToCancel) return;
    try {
      const response = await authFetch(`${API_BASE_URL}/api/v1/tickets/${ticketToCancel.originalId}/cancel`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        setTicketsList(prev => prev.map(t => 
          t.originalId === ticketToCancel.originalId ? { ...t, status: 'cancelled' } : t
        ));
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.error || 'Không thể hủy vé'}`);
      }
    } catch (err) {
      console.error("Error cancelling ticket:", err);
      alert("Lỗi kết nối đến server");
    } finally {
      setIsConfirmOpen(false);
      setTicketToCancel(null);
    }
  };

  if (isLoading) {
    return (
      <div className="tickets-page">
        <TicketsToolbar />
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Đang tải dữ liệu vé...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tickets-page">
        <TicketsToolbar />
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <TicketsToolbar />
      
      <TicketsFilter 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        tripFilter={tripFilter}
        onTripFilterChange={handleTripFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
        uniqueTrips={uniqueTrips}
      />

      <TicketsTable 
        data={paginatedTickets}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewClick={handleViewTicket}
        onCancelClick={handleCancelTicket}
      />

      <TicketDetailsModal 
        key={isModalOpen ? 'open' : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={selectedTicket}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setTicketToCancel(null);
        }}
        onConfirm={executeCancelTicket}
        title="Xác nhận hủy vé"
        message={`Bạn có chắc chắn muốn hủy vé ${ticketToCancel?.id} của khách hàng ${ticketToCancel?.customerName} không?`}
        confirmText="Hủy vé"
        cancelText="Đóng"
        type="danger"
      />
    </div>
  );
};

export default Tickets;