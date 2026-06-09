package com.haothanh.booking.service;

import com.haothanh.booking.dto.TicketResponseDTO;
import java.util.List;

public interface TicketService {
    List<TicketResponseDTO> getAllTickets();
    void cancelTicket(Long ticketId);
}
