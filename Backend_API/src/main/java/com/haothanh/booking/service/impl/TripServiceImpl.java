package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.TripResponseDTO;
import com.haothanh.booking.entity.Trip;
import com.haothanh.booking.repository.TripRepository;
import com.haothanh.booking.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDTO> getTrips(String route) {
        List<Trip> trips;
        
        // Use custom query if route filter is provided, otherwise fetch all trips
        if (route != null && !route.trim().isEmpty()) {
            trips = tripRepository.findByRouteContainingIgnoreCase(route.trim());
        } else {
            trips = tripRepository.findAll();
        }

        return trips.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private TripResponseDTO mapToResponseDTO(Trip trip) {
        return TripResponseDTO.builder()
                .id(trip.getId())
                .route(trip.getRoute())
                .departureTime(trip.getDepartureTime())
                .basePrice(trip.getBasePrice())
                .status(trip.getStatus())
                // Safe navigation in case trip.getBus() is somehow null (though DB constraints say nullable=false)
                .licensePlate(trip.getBus() != null ? trip.getBus().getLicensePlate() : null)
                .build();
    }
}
