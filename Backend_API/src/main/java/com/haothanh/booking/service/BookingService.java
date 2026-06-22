package com.haothanh.booking.service;

import com.haothanh.booking.dto.BookingRequestDTO;
import com.haothanh.booking.entity.Booking;
import com.haothanh.booking.entity.BookingSeat;
import com.haothanh.booking.entity.Trip;
import com.haothanh.booking.repository.BookingRepository;
import com.haothanh.booking.repository.BookingSeatRepository;
import com.haothanh.booking.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final TripRepository tripRepository;
    private final RedissonClient redissonClient;
    private final TransactionTemplate transactionTemplate;

    @CacheEvict(value = "trip-seat-map", key = "#request.tripId")
    public Booking createBooking(BookingRequestDTO request) {
        Long tripId = request.getTripId();
        if (tripId == null) {
            throw new IllegalArgumentException("Trip ID must not be null");
        }

        RLock lock = redissonClient.getLock("lock:trip:" + tripId);
        boolean isLocked = false;
        try {
            isLocked = lock.tryLock(5, 10, TimeUnit.SECONDS);
            if (!isLocked) {
                throw new com.haothanh.booking.exception.ResourceLockedException("Hệ thống đang xử lý quá nhiều yêu cầu, vui lòng thử lại sau ít phút!");
            }

            return transactionTemplate.execute(status -> {
                // 1. Fetch Trip
                Trip trip = tripRepository.findById(tripId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến đi (Trip) với ID: " + tripId));

                // 2. Validate duplicate seats
                List<String> bookedSeats = bookingSeatRepository.findBookedSeatsByTripAndSeatNumbers(tripId, request.getSeatNumbers());
                if (!bookedSeats.isEmpty()) {
                    throw new RuntimeException("Ghế " + String.join(", ", bookedSeats) + " đã được đặt, vui lòng chọn ghế khác!");
                }

                String normalizedStatus = request.getPaymentStatus();
                if ("paid".equalsIgnoreCase(normalizedStatus)) {
                    normalizedStatus = "PAID";
                } else if ("unpaid".equalsIgnoreCase(normalizedStatus)) {
                    normalizedStatus = "PENDING";
                }

                // 3. Create Booking
                Booking booking = Booking.builder()
                        .trip(trip)
                        .customerName(request.getCustomerName())
                        .customerPhone(request.getCustomerPhone())
                        .pickupPoint(request.getPickupPoint())
                        .dropoffPoint(request.getDropoffPoint())
                        .note(request.getNotes())
                        .paymentStatus(normalizedStatus)
                        .totalAmount(request.getTotalPrice())
                        .build();

                // 4. Create BookingSeats
                List<BookingSeat> bookingSeats = request.getSeatNumbers().stream()
                        .map(seatNumber -> BookingSeat.builder()
                                .booking(booking)
                                .seatNumber(seatNumber)
                                .build())
                        .toList();

                booking.setSeats(bookingSeats);

                // 5. Save (Cascade.ALL will save bookingSeats as well)
                return bookingRepository.save(booking);
            });
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new com.haothanh.booking.exception.ResourceLockedException("Lỗi hệ thống khi giữ ghế, vui lòng thử lại!");
        } finally {
            if (isLocked && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}