import { useState, useMemo, useEffect } from 'react';
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
  
  const itemsPerPage = 5;

  // Fetch data from API
  const fetchTickets = async () => {
    try {
        const response = await authFetch(`${API_BASE_URL}/api/v1/tickets`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Map backend DTO to frontend format
        const formattedData = data.map(t => {
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
    // eslint-disable-next-line
    fetchTickets();
  }, []);

  const handleUpdateSuccess = () => {
    fetchTickets();
  };


  // Compute unique trips for filter dropdown
  const uniqueTrips = useMemo(() => {
    const trips = new Set();
    const tripOptions = [];
    ticketsList.forEach(ticket => {
      if (!trips.has(ticket.tripCode)) {
        trips.add(ticket.tripCode);
        tripOptions.push({ value: ticket.tripCode, label: `${ticket.tripCode} (${ticket.route})` });
      }
    });
    return tripOptions;
  }, [ticketsList]);

  // Filter logic
  const filteredTickets = useMemo(() => {
    return ticketsList.filter((ticket) => {
      // Text search (ID, Name, Phone)
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        ticket.id.toLowerCase().includes(lowerSearch) || 
        ticket.customerName.toLowerCase().includes(lowerSearch) ||
        ticket.customerPhone.includes(searchTerm);
      
      // Trip filter
      const matchesTrip = tripFilter === 'all' || ticket.tripCode === tripFilter;
      
      // Status filter
      let statusToMatch = statusFilter;
      // Map 'pending' from db to 'unpaid' in filter if needed, or update filter options
      if (statusFilter === 'unpaid') statusToMatch = 'pending';
      const matchesStatus = statusFilter === 'all' || ticket.status === statusToMatch;

      // Date filter
      let matchesDate = true;
      if (dateFilter !== 'all' && ticket.rawDate) {
        const ticketDate = new Date(ticket.rawDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        
        const ticketDay = new Date(ticketDate);
        ticketDay.setHours(0, 0, 0, 0);

        if (dateFilter === 'today') {
          matchesDate = ticketDay.getTime() === today.getTime();
        } else if (dateFilter === 'yesterday') {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          matchesDate = ticketDay.getTime() === yesterday.getTime();
        } else if (dateFilter === 'this_week') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday
          matchesDate = ticketDay >= startOfWeek;
        } else if (dateFilter === 'this_month') {
          matchesDate = ticketDay.getMonth() === today.getMonth() && ticketDay.getFullYear() === today.getFullYear();
        }
      }

      return matchesSearch && matchesTrip && matchesStatus && matchesDate;
    });
  }, [searchTerm, tripFilter, statusFilter, dateFilter, ticketsList]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTickets.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTickets, currentPage]);

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
