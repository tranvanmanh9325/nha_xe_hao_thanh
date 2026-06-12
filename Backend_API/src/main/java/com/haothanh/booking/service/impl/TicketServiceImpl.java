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
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.cache.CacheManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.AccessDeniedException;
import com.haothanh.booking.security.CustomUserDetails;

import java.util.concurrent.TimeUnit;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final RedissonClient redissonClient;
    private final CacheManager cacheManager;
    private final PasswordEncoder passwordEncoder;

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
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé"));

        // IDOR Check: Ensure user owns the ticket, or is ADMIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    
            if (!isAdmin) {
                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
                if (!ticket.getUser().getId().equals(userDetails.getId())) {
                    throw new AccessDeniedException("Bạn không có quyền hủy vé của người khác.");
                }
            }
        }

        if ("CANCELLED".equalsIgnoreCase(ticket.getPaymentStatus())) {
            throw new RuntimeException("Vé đã bị hủy trước đó");
        }
        
        ticket.setPaymentStatus("CANCELLED");
        ticketRepository.save(ticket);
        
        // Evict cache
        var cache = cacheManager.getCache("trip-seat-map");
        if (cache != null) {
            cache.evict(ticket.getTrip().getId());
        }
    }

    @Override
    @Transactional
    public TicketResponseDTO bookOfflineTicket(TicketRequestDTO request) {
        String lockKey = "lock:seat:" + request.getTripId() + ":" + request.getSeatCode();
        RLock lock = redissonClient.getLock(lockKey);

        try {
            // Attempt to acquire lock. Wait up to 3 seconds, hold for 10 seconds.
            boolean isLocked = lock.tryLock(3, 10, TimeUnit.SECONDS);
            
            if (!isLocked) {
                log.warn("Could not acquire lock for trip {} and seat {}. System busy.", request.getTripId(), request.getSeatCode());
                throw new RuntimeException("Hệ thống đang xử lý ghế này, vui lòng thử lại sau.");
            }
            
            try {
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
                                    .password(passwordEncoder.encode(request.getCustomerPhone())) // Hash password
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

                // 5. Evict cache
                var cache = cacheManager.getCache("trip-seat-map");
                if (cache != null) {
                    cache.evict(trip.getId());
                }

                return mapToDTO(ticket);
                
            } finally {
                if (lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Bị gián đoạn khi đang giữ chỗ.");
        }
    }
}
