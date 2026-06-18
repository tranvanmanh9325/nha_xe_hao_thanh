package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RouteRepository extends JpaRepository<Route, Long> {
    boolean existsByRouteCode(String routeCode);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT r.origin FROM Route r WHERE r.status = :status")
    java.util.List<String> findDistinctOrigins(@org.springframework.data.repository.query.Param("status") String status);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT r.destination FROM Route r WHERE r.status = :status")
    java.util.List<String> findDistinctDestinations(@org.springframework.data.repository.query.Param("status") String status);
}