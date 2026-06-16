package com.haothanh.booking.controller;

import com.haothanh.booking.dto.BookingRequestDTO;
import com.haothanh.booking.entity.Booking;
import com.haothanh.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequestDTO request) {
        try {
            Booking booking = bookingService.createBooking(request);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đặt vé thành công");
            response.put("bookingId", booking.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
}