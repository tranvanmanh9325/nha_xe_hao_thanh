package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.TripResponseDTO;
import com.haothanh.booking.dto.TripSeatMapResponseDTO;
import com.haothanh.booking.entity.Trip;
import com.haothanh.booking.repository.TicketRepository;
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
    private final TicketRepository ticketRepository;

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

    @Override
    @Transactional(readOnly = true)
    public TripSeatMapResponseDTO getTripSeatMap(Long tripId) {
        Trip trip = tripRepository.findById(java.util.Objects.requireNonNull(tripId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến xe"));
        com.haothanh.booking.entity.Bus bus = trip.getBus();
        
        List<String> statuses = java.util.Arrays.asList("PAID", "PENDING");
        List<String> bookedSeats = ticketRepository.findBookedSeatsByTripId(java.util.Objects.requireNonNull(tripId), statuses);
        
        return TripSeatMapResponseDTO.builder()
                .tripId(tripId)
                .licensePlate(bus != null ? bus.getLicensePlate() : null)
                .busType(bus != null ? bus.getBusType() : null)
                .layoutConfig(bus != null ? bus.getLayoutConfig() : null)
                .route(trip.getRoute())
                .departureTime(trip.getDepartureTime())
                .basePrice(trip.getBasePrice())
                .bookedSeats(bookedSeats)
                .build();
    }
}
