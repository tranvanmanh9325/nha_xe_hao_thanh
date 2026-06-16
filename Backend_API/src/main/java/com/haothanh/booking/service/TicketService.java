package com.haothanh.booking.service;

import com.haothanh.booking.dto.TicketResponseDTO;
import java.util.List;

public interface TicketService {
    List<TicketResponseDTO> getAllTickets();
    void cancelTicket(Long ticketId);
    TicketResponseDTO bookOfflineTicket(com.haothanh.booking.dto.TicketRequestDTO request);

    TicketResponseDTO updateTicket(Long ticketId, com.haothanh.booking.dto.TicketUpdateRequestDTO request);
}
