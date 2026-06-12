package com.haothanh.booking.service;

import com.haothanh.booking.dto.RouteRequestDTO;
import com.haothanh.booking.dto.RouteResponseDTO;
import com.haothanh.booking.entity.Route;
import com.haothanh.booking.repository.RouteRepository;
import com.haothanh.booking.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;
    private final TripRepository tripRepository;

    @Override
    @Cacheable("routes")
    public List<RouteResponseDTO> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "routes", key = "#id")
    public RouteResponseDTO getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuyến đường"));
        return mapToDTO(route);
    }

    @Override
    @CacheEvict(value = "routes", allEntries = true)
    public RouteResponseDTO createRoute(RouteRequestDTO requestDTO) {
        if (routeRepository.existsByRouteCode(requestDTO.getRouteCode())) {
            throw new RuntimeException("Mã tuyến đường đã tồn tại");
        }
        Route route = Route.builder()
                .routeCode(requestDTO.getRouteCode())
                .origin(requestDTO.getOrigin())
                .destination(requestDTO.getDestination())
                .distance(requestDTO.getDistance())
                .estimatedDuration(requestDTO.getEstimatedDuration())
                .status(requestDTO.getStatus() != null ? requestDTO.getStatus() : "Đang hoạt động")
                .build();
        return mapToDTO(routeRepository.save(route));
    }

    @Override
    @CacheEvict(value = "routes", allEntries = true)
    public RouteResponseDTO updateRoute(Long id, RouteRequestDTO requestDTO) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuyến đường"));

        if (!route.getRouteCode().equals(requestDTO.getRouteCode()) &&
                routeRepository.existsByRouteCode(requestDTO.getRouteCode())) {
            throw new RuntimeException("Mã tuyến đường đã tồn tại");
        }

        route.setRouteCode(requestDTO.getRouteCode());
        route.setOrigin(requestDTO.getOrigin());
        route.setDestination(requestDTO.getDestination());
        route.setDistance(requestDTO.getDistance());
        route.setEstimatedDuration(requestDTO.getEstimatedDuration());
        if (requestDTO.getStatus() != null) {
            route.setStatus(requestDTO.getStatus());
        }

        return mapToDTO(routeRepository.save(route));
    }

    @Override
    @CacheEvict(value = "routes", allEntries = true)
    public RouteResponseDTO updateRouteStatus(Long id, String status) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuyến đường"));
        route.setStatus(status);
        return mapToDTO(routeRepository.save(route));
    }

    @Override
    @CacheEvict(value = "routes", allEntries = true)
    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuyến đường"));
        
        // Kiểm tra xem tuyến đường đã có chuyến xe chưa (dựa trên chuỗi origin - destination)
        String routeName = route.getOrigin() + " - " + route.getDestination();
        if (tripRepository.existsByRoute(routeName)) {
            throw new RuntimeException("Không thể xóa tuyến đường này vì đã có chuyến xe hoạt động.");
        }

        routeRepository.delete(route);
    }

    private RouteResponseDTO mapToDTO(Route route) {
        RouteResponseDTO dto = new RouteResponseDTO();
        dto.setId(route.getId());
        dto.setRouteCode(route.getRouteCode());
        dto.setOrigin(route.getOrigin());
        dto.setDestination(route.getDestination());
        dto.setDistance(route.getDistance());
        dto.setEstimatedDuration(route.getEstimatedDuration());
        dto.setStatus(route.getStatus());
        dto.setCreatedAt(route.getCreatedAt());
        dto.setUpdatedAt(route.getUpdatedAt());
        return dto;
    }
}
