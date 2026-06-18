package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.TripResponseDTO;
import com.haothanh.booking.dto.TripSeatMapResponseDTO;
import com.haothanh.booking.entity.Trip;
import com.haothanh.booking.repository.BookingSeatRepository;
import com.haothanh.booking.repository.TicketRepository;
import com.haothanh.booking.repository.TripRepository;
import com.haothanh.booking.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final TicketRepository ticketRepository;
    private final BookingSeatRepository bookingSeatRepository;

    @Override
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<TripResponseDTO> getTrips(String route, String status, java.time.OffsetDateTime startDate, java.time.OffsetDateTime endDate, String searchTerm, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.jpa.domain.Specification<Trip> spec = (root, query, cb) -> {
            java.util.List<jakarta.persistence.criteria.Predicate> predicates = new java.util.ArrayList<>();
            
            if (route != null && !route.trim().isEmpty() && !route.equals("all")) {
                predicates.add(cb.equal(root.get("route"), route.trim()));
            }
            if (status != null && !status.trim().isEmpty() && !status.equals("all")) {
                predicates.add(cb.equal(root.get("status"), status.trim()));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("departureTime"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("departureTime"), endDate));
            }
            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                String pattern = "%" + searchTerm.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                    cb.like(root.get("id").as(String.class), pattern),
                    cb.like(cb.lower(root.join("bus").get("licensePlate")), pattern)
                ));
            }
            
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        org.springframework.data.domain.Pageable safePageable = pageable != null ? pageable : org.springframework.data.domain.Pageable.unpaged();
        org.springframework.data.domain.Page<Trip> trips = tripRepository.findAll(spec, safePageable);
        return trips.map(this::mapToResponseDTO);
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
                .busNumber(trip.getBus() != null ? trip.getBus().getBusNumber() : null)
                .driver(trip.getDriver())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "trip-seat-map", key = "#tripId")
    public TripSeatMapResponseDTO getTripSeatMap(Long tripId) {
        Trip trip = tripRepository.findById(java.util.Objects.requireNonNull(tripId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến xe"));
        com.haothanh.booking.entity.Bus bus = trip.getBus();
        
        List<String> statuses = java.util.Arrays.asList("PAID", "PENDING", "paid", "unpaid");
        List<String> bookedSeats = new java.util.ArrayList<>();
        bookedSeats.addAll(ticketRepository.findBookedSeatsByTripId(java.util.Objects.requireNonNull(tripId), statuses));
        bookedSeats.addAll(bookingSeatRepository.findBookedSeatsByTripId(java.util.Objects.requireNonNull(tripId), statuses));
        
        bookedSeats = bookedSeats.stream().distinct().collect(Collectors.toList());
        
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

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = {"trips", "trip-seat-map"}, allEntries = true)
    public void cancelTrip(Long tripId) {
        Trip trip = tripRepository.findById(java.util.Objects.requireNonNull(tripId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến xe"));
        if (!"SCHEDULED".equals(trip.getStatus())) {
            throw new RuntimeException("Chỉ có thể hủy các chuyến xe Sắp chạy");
        }
        trip.setStatus("CANCELLED");
        tripRepository.save(trip);
    }
}
