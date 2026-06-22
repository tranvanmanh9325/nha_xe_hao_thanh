package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TripRepository extends JpaRepository<Trip, Long>, JpaSpecificationExecutor<Trip> {

    org.springframework.data.domain.Page<Trip> findByRouteContainingIgnoreCase(String route, org.springframework.data.domain.Pageable pageable);
    boolean existsByBusId(Long busId);
    boolean existsByRoute(String route);

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(t) FROM Trip t WHERE t.departureTime >= :startDate AND t.departureTime <= :endDate")
    long countTripsByDateRange(@org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate);

    List<Trip> findByDepartureTimeGreaterThanEqualOrderByDepartureTimeAsc(java.time.OffsetDateTime now, org.springframework.data.domain.Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT t FROM Trip t JOIN FETCH t.bus WHERE t.departureTime >= :now ORDER BY t.departureTime ASC")
    List<Trip> findWithBusByDepartureTimeGreaterThanEqualOrderByDepartureTimeAsc(@org.springframework.data.repository.query.Param("now") java.time.OffsetDateTime now, org.springframework.data.domain.Pageable pageable);
}