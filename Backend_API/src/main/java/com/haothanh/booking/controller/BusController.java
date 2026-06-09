package com.haothanh.booking.controller;

import com.haothanh.booking.dto.BusResponseDTO;
import com.haothanh.booking.service.BusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
