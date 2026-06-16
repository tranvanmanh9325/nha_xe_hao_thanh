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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final TripRepository tripRepository;

    @Transactional
    @CacheEvict(value = "trip-seat-map", key = "#request.tripId")
    public Booking createBooking(BookingRequestDTO request) {
        Long tripId = request.getTripId();
        if (tripId == null) {
            throw new IllegalArgumentException("Trip ID must not be null");
        }

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
    }
}