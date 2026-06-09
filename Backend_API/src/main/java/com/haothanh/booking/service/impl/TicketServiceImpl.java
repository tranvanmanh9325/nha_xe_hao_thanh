package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.TicketResponseDTO;
import com.haothanh.booking.entity.Ticket;
import com.haothanh.booking.repository.TicketRepository;
import com.haothanh.booking.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TicketResponseDTO> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAllWithDetails();
        return tickets.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private TicketResponseDTO mapToDTO(Ticket ticket) {
        return TicketResponseDTO.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .seatCode(ticket.getSeatCode())
                .totalPrice(ticket.getTotalPrice())
                .paymentStatus(ticket.getPaymentStatus())
                .customerName(ticket.getUser().getFullName())
                .customerPhone(ticket.getUser().getPhone())
                .route(ticket.getTrip().getRoute())
                .departureTime(ticket.getTrip().getDepartureTime())
                .tripId(ticket.getTrip().getId())
                .build();
    }
}
