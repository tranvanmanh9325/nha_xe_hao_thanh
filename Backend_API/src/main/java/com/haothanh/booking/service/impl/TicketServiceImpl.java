package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.TicketResponseDTO;
import com.haothanh.booking.entity.Ticket;
import com.haothanh.booking.repository.TicketRepository;
import com.haothanh.booking.service.TicketService;
import com.haothanh.booking.dto.TicketRequestDTO;
import com.haothanh.booking.entity.Trip;
import com.haothanh.booking.entity.User;
import com.haothanh.booking.repository.TripRepository;
import com.haothanh.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;

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

    @Override
    @Transactional
    public void cancelTicket(Long ticketId) {
        if (ticketId == null) {
            throw new IllegalArgumentException("Mã vé không hợp lệ");
        }
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if ("CANCELLED".equalsIgnoreCase(ticket.getPaymentStatus())) {
            throw new RuntimeException("Vé đã bị hủy trước đó");
        }
        
        ticket.setPaymentStatus("CANCELLED");
        ticketRepository.save(ticket);
    }

    @Override
    @Transactional
    public TicketResponseDTO bookOfflineTicket(TicketRequestDTO request) {
        // 1. Check if trip exists
        Trip trip = tripRepository.findById(java.util.Objects.requireNonNull(request.getTripId(), "Trip ID cannot be null"))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến xe với ID: " + request.getTripId()));

        // 2. Check if seat is already booked (PAID or PENDING)
        List<String> bookedSeats = ticketRepository.findBookedSeatsByTripId(
                java.util.Objects.requireNonNull(request.getTripId()), 
                java.util.Arrays.asList("PAID", "PENDING")
        );
        
        if (bookedSeats.contains(request.getSeatCode())) {
            throw new RuntimeException("Ghế " + request.getSeatCode() + " đã được đặt.");
        }

        // 3. Find user by phone, or create GUEST user
        User user = userRepository.findByPhone(request.getCustomerPhone())
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .fullName(request.getCustomerName())
                            .phone(request.getCustomerPhone())
                            .role("GUEST")
                            .password(request.getCustomerPhone()) // default password
                            .build();
                    return userRepository.save(java.util.Objects.requireNonNull(newUser));
                });

        // 4. Create Ticket
        Ticket ticket = Ticket.builder()
                .trip(trip)
                .user(user)
                .ticketCode(UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .seatCode(request.getSeatCode())
                .totalPrice(trip.getBasePrice())
                .paymentStatus("PAID") // Offline booking is paid immediately
                .build();

        ticketRepository.save(java.util.Objects.requireNonNull(ticket));

        return mapToDTO(ticket);
    }
}
