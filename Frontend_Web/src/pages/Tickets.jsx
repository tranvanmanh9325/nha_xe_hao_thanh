import { useState, useMemo } from 'react';
import TicketsToolbar from '../components/tickets/TicketsToolbar';
import TicketsFilter from '../components/tickets/TicketsFilter';
import TicketsTable from '../components/tickets/TicketsTable';
import TicketDetailsModal from '../components/tickets/TicketDetailsModal';
import { ticketsData } from '../data/mockData';
import '../styles/tickets.css';

const Tickets = () => {
  const [ticketsList, setTicketsList] = useState(ticketsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [tripFilter, setTripFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 5;

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

  const handleCancelTicket = (ticketId) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy vé này?')) {
      setTicketsList(prev => prev.map(t => 
        t.id === ticketId ? { ...t, status: 'cancelled' } : t
      ));
    }
  };

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
