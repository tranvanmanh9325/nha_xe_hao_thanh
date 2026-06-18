package com.haothanh.booking.controller;

import com.haothanh.booking.dto.TripResponseDTO;
import com.haothanh.booking.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    /**
     * Endpoint to fetch all trips. 
     * Supports optional 'route' parameter for searching trips by route string.
     *
     * @param route Search query for route (optional)
     * @return List of TripResponseDTOs wrapped in ResponseEntity
     */
    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<TripResponseDTO>> getTrips(
            @RequestParam(required = false, defaultValue = "all") String route,
            @RequestParam(required = false, defaultValue = "all") String status,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.OffsetDateTime endDate,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        org.springframework.data.domain.Page<TripResponseDTO> trips = tripService.getTrips(route, status, startDate, endDate, searchTerm, pageable);
        return ResponseEntity.ok(trips);
    }

    /**
     * Endpoint to fetch the seat map for a specific trip, including layout and booked seats.
     *
     * @param id The ID of the trip
     * @return TripSeatMapResponseDTO wrapped in ResponseEntity
     */
    @GetMapping("/{id}/seats")
    public ResponseEntity<com.haothanh.booking.dto.TripSeatMapResponseDTO> getTripSeatMap(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripSeatMap(id));
    }

    /**
     * Endpoint to cancel a specific trip.
     *
     * @param id The ID of the trip
     * @return Success message
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<String> cancelTrip(@PathVariable Long id) {
        tripService.cancelTrip(id);
        return ResponseEntity.ok("Chuyến xe đã được hủy thành công");
    }
}
