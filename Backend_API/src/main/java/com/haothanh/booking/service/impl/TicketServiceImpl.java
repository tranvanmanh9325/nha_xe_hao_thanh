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
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.UUID;
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
    private final TransactionTemplate transactionTemplate;

    @Override
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<TicketResponseDTO> getAllTickets(String search, Long tripId, String status, String dateFilter, org.springframework.data.domain.Pageable pageable) {
        java.time.OffsetDateTime startDate = null;
        java.time.OffsetDateTime endDate = null;
        
        if (dateFilter != null && !dateFilter.equals("all")) {
            java.time.OffsetDateTime now = java.time.OffsetDateTime.now();
            java.time.OffsetDateTime startOfToday = now.with(java.time.LocalTime.MIN);
            java.time.OffsetDateTime endOfToday = now.with(java.time.LocalTime.MAX);
            
            switch (dateFilter) {
                case "today":
                    startDate = startOfToday;
                    endDate = endOfToday;
                    break;
                case "yesterday":
                    startDate = startOfToday.minusDays(1);
                    endDate = endOfToday.minusDays(1);
                    break;
                case "this_week":
                    startDate = startOfToday.with(java.time.temporal.TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY));
                    endDate = endOfToday.with(java.time.temporal.TemporalAdjusters.nextOrSame(java.time.DayOfWeek.SUNDAY));
                    break;
                case "this_month":
                    startDate = startOfToday.with(java.time.temporal.TemporalAdjusters.firstDayOfMonth());
                    endDate = endOfToday.with(java.time.temporal.TemporalAdjusters.lastDayOfMonth());
                    break;
            }
        }
        
        if ("pending".equalsIgnoreCase(status) || "unpaid".equalsIgnoreCase(status)) {
            status = "PENDING";
        } else if ("paid".equalsIgnoreCase(status)) {
            status = "PAID";
        } else if ("cancelled".equalsIgnoreCase(status)) {
            status = "CANCELLED";
        } else {
            status = null;
        }
        
        if (search != null && search.trim().isEmpty()) {
            search = null;
        }

        org.springframework.data.domain.Page<Ticket> tickets = ticketRepository.findAllWithFilters(search, tripId, status, startDate, endDate, pageable);
        return tickets.map(this::mapToDTO);
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
                .createdAt(ticket.getCreatedAt())
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
    public TicketResponseDTO bookOfflineTicket(TicketRequestDTO request) {
        String lockKey = "lock:seat:" + request.getTripId() + ":" + request.getSeatCode();
        RLock lock = redissonClient.getLock(lockKey);
        boolean isLocked = false;

        try {
            // Attempt to acquire lock. Wait up to 3 seconds, hold for 10 seconds.
            isLocked = lock.tryLock(3, 10, TimeUnit.SECONDS);
            
            if (!isLocked) {
                log.warn("Could not acquire lock for trip {} and seat {}. System busy.", request.getTripId(), request.getSeatCode());
                throw new com.haothanh.booking.exception.ResourceLockedException("Hệ thống đang xử lý ghế này, vui lòng thử lại sau.");
            }
            
            return transactionTemplate.execute(status -> {
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
            });
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new com.haothanh.booking.exception.ResourceLockedException("Bị gián đoạn khi đang giữ chỗ.");
        } finally {
            if (isLocked && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    @Override
    public TicketResponseDTO updateTicket(Long ticketId, com.haothanh.booking.dto.TicketUpdateRequestDTO request) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vé"));

        String newStatus = request.getPaymentStatus();
        if ("paid".equalsIgnoreCase(newStatus)) {
            newStatus = "PAID";
        } else if ("unpaid".equalsIgnoreCase(newStatus) || "pending".equalsIgnoreCase(newStatus)) {
            newStatus = "PENDING";
        } else if ("cancelled".equalsIgnoreCase(newStatus)) {
            newStatus = "CANCELLED";
        }

        String currentSeat = ticket.getSeatCode();
        String newSeat = request.getNewSeatCode();

        RLock lock = null;
        boolean isLocked = false;

        if (newSeat != null && !newSeat.equals(currentSeat)) {
            // Need to change seat, acquire lock first
            String lockKey = "lock:seat:" + ticket.getTrip().getId() + ":" + newSeat;
            lock = redissonClient.getLock(lockKey);

            try {
                isLocked = lock.tryLock(3, 10, TimeUnit.SECONDS);
                if (!isLocked) {
                    throw new com.haothanh.booking.exception.ResourceLockedException("Ghế mới đang được xử lý bởi người khác, vui lòng thử lại.");
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new com.haothanh.booking.exception.ResourceLockedException("Bị gián đoạn khi đang giữ ghế mới.");
            }
        }

        try {
            final String finalNewStatus = newStatus;
            return transactionTemplate.execute(status -> {
                // Re-fetch ticket to ensure it is attached to the current session
                Ticket attachedTicket = ticketRepository.findById(ticketId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy vé"));

                if (newSeat != null && !newSeat.equals(currentSeat)) {
                    List<String> bookedSeats = ticketRepository.findBookedSeatsByTripId(
                            attachedTicket.getTrip().getId(), 
                            java.util.Arrays.asList("PAID", "PENDING")
                    );
                    
                    if (bookedSeats.contains(newSeat)) {
                        throw new RuntimeException("Ghế " + newSeat + " đã có người đặt.");
                    }

                    attachedTicket.setSeatCode(newSeat);
                }

                attachedTicket.setPaymentStatus(finalNewStatus);
                ticketRepository.save(attachedTicket);

                var cache = cacheManager.getCache("trip-seat-map");
                if (cache != null) {
                    cache.evict(attachedTicket.getTrip().getId());
                }

                return mapToDTO(attachedTicket);
            });
        } finally {
            if (lock != null && isLocked && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}