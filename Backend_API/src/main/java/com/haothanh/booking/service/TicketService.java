package com.haothanh.booking.service;

import com.haothanh.booking.dto.TicketResponseDTO;
public interface TicketService {
    org.springframework.data.domain.Page<TicketResponseDTO> getAllTickets(String search, Long tripId, String status, String dateFilter, org.springframework.data.domain.Pageable pageable);
    void cancelTicket(Long ticketId);
    TicketResponseDTO bookOfflineTicket(com.haothanh.booking.dto.TicketRequestDTO request);

    TicketResponseDTO updateTicket(Long ticketId, com.haothanh.booking.dto.TicketUpdateRequestDTO request);
}