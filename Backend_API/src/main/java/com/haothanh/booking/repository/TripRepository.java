package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByRouteContainingIgnoreCase(String route);
    boolean existsByBusId(Long busId);
    boolean existsByRoute(String route);
}
