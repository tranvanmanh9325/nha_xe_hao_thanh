package com.haothanh.booking.controller;

import com.haothanh.booking.dto.RouteRequestDTO;
import com.haothanh.booking.dto.RouteResponseDTO;
import com.haothanh.booking.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public ResponseEntity<List<RouteResponseDTO>> getAllRoutes() {
        return ResponseEntity.ok(routeService.getAllRoutes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteResponseDTO> getRouteById(@PathVariable Long id) {
        return ResponseEntity.ok(routeService.getRouteById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteResponseDTO> createRoute(@Valid @RequestBody RouteRequestDTO requestDTO) {
        return ResponseEntity.ok(routeService.createRoute(requestDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteResponseDTO> updateRoute(@PathVariable Long id, @Valid @RequestBody RouteRequestDTO requestDTO) {
        return ResponseEntity.ok(routeService.updateRoute(id, requestDTO));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RouteResponseDTO> updateRouteStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(routeService.updateRouteStatus(id, body.get("status")));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRoute(@PathVariable Long id) {
        try {
            routeService.deleteRoute(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
