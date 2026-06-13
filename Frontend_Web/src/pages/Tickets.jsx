import { useState, useMemo, useEffect } from 'react';
import TicketsToolbar from '../components/tickets/TicketsToolbar';
import TicketsFilter from '../components/tickets/TicketsFilter';
import TicketsTable from '../components/tickets/TicketsTable';
import TicketDetailsModal from '../components/tickets/TicketDetailsModal';
import { authFetch } from '../utils/authService';
import '../styles/tickets.css';

const Tickets = () => {
  const [ticketsList, setTicketsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tripFilter, setTripFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 5;

  // Fetch data from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const response = await authFetch('http://localhost:8080/api/v1/tickets');
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

          return {
            id: t.ticketCode,
            customerName: t.customerName,
            customerPhone: t.customerPhone,
            route: t.route,
            departureTime: formattedDate,
            tripCode: `TRIP-${t.tripId}`,
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

    fetchTickets();
  }, []);

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
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

      return matchesSearch && matchesTrip && matchesStatus;
    });
  }, [searchTerm, tripFilter, statusFilter, ticketsList]);

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

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCancelTicket = async (ticket) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy vé này không?')) {
      try {
        const response = await authFetch(`http://localhost:8080/api/v1/tickets/${ticket.originalId}/cancel`, {
          method: 'PUT'
        });
        
        if (response.ok) {
          setTicketsList(prev => prev.map(t => 
            t.originalId === ticket.originalId ? { ...t, status: 'cancelled' } : t
          ));
        } else {
          const errorData = await response.json();
          alert(`Lỗi: ${errorData.error || 'Không thể hủy vé'}`);
        }
      } catch (err) {
        console.error("Error cancelling ticket:", err);
        alert("Lỗi kết nối đến server");
      }
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
};

export default Tickets;
