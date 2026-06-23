package com.haothanh.booking.service;

import com.haothanh.booking.dto.TicketResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.haothanh.booking.dto.TicketRequestDTO;
import com.haothanh.booking.dto.TicketUpdateRequestDTO;

public interface TicketService {
    Page<TicketResponseDTO> getAllTickets(String search, Long tripId, String status, String dateFilter, Pageable pageable);
    void cancelTicket(Long ticketId);
    TicketResponseDTO bookOfflineTicket(TicketRequestDTO request);
    TicketResponseDTO updateTicket(Long ticketId, TicketUpdateRequestDTO request);
    Page<TicketResponseDTO> getMyTickets(Long userId, String status, Pageable pageable);
}