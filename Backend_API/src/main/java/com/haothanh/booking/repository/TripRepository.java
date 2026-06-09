package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByRouteContainingIgnoreCase(String route);
}
