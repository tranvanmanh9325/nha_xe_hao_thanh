package com.haothanh.booking.service;

import com.haothanh.booking.dto.RouteRequestDTO;
import com.haothanh.booking.dto.RouteResponseDTO;

import java.util.List;

public interface RouteService {
    List<RouteResponseDTO> getAllRoutes();
    RouteResponseDTO getRouteById(Long id);
    RouteResponseDTO createRoute(RouteRequestDTO requestDTO);
    RouteResponseDTO updateRoute(Long id, RouteRequestDTO requestDTO);
    RouteResponseDTO updateRouteStatus(Long id, String status);
    void deleteRoute(Long id);
}
