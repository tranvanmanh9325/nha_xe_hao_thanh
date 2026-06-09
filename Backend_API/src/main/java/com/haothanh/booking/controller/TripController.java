package com.haothanh.booking.controller;

import com.haothanh.booking.dto.TripResponseDTO;
import com.haothanh.booking.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trips")
@CrossOrigin(origins = "http://localhost:3000") // Enable CORS for the React frontend
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
    public ResponseEntity<List<TripResponseDTO>> getTrips(
            @RequestParam(required = false) String route) {
        
        List<TripResponseDTO> trips = tripService.getTrips(route);
        return ResponseEntity.ok(trips);
    }
}
