package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByRouteContainingIgnoreCase(String route);
    boolean existsByBusId(Long busId);
    boolean existsByRoute(String route);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(t) FROM Trip t WHERE t.departureTime >= :startDate AND t.departureTime <= :endDate")
    long countTripsByDateRange(@org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate);

    List<Trip> findTop8ByDepartureTimeGreaterThanEqualOrderByDepartureTimeAsc(java.time.OffsetDateTime now);
}