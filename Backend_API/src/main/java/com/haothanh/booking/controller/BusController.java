package com.haothanh.booking.controller;

import com.haothanh.booking.dto.BusResponseDTO;
import com.haothanh.booking.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.haothanh.booking.dto.BusLayoutRequestDTO;
import com.haothanh.booking.dto.BusRequestDTO;

import java.util.List;

@RestController
@RequestMapping("/api/v1/buses")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    @GetMapping
    public ResponseEntity<List<BusResponseDTO>> getAllBuses() {
        return ResponseEntity.ok(busService.findAllBuses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusResponseDTO> getBusById(@PathVariable Long id) {
        return ResponseEntity.ok(busService.getBusById(id));
    }

    @PutMapping("/{id}/layout")
    public ResponseEntity<BusResponseDTO> updateBusLayout(
            @PathVariable Long id, 
            @RequestBody BusLayoutRequestDTO request) {
        return ResponseEntity.ok(busService.updateBusLayout(id, request.getLayoutConfig()));
    }

    @PostMapping
    public ResponseEntity<BusResponseDTO> createBus(@RequestBody BusRequestDTO request) {
        return ResponseEntity.ok(busService.createBus(request));
    }
}
