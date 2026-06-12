package com.haothanh.booking.controller;

import com.haothanh.booking.dto.TicketResponseDTO;
import com.haothanh.booking.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.haothanh.booking.dto.TicketRequestDTO;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketResponseDTO>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @PostMapping("/offline")
    public ResponseEntity<TicketResponseDTO> bookOfflineTicket(@Valid @RequestBody TicketRequestDTO request) {
        return ResponseEntity.ok(ticketService.bookOfflineTicket(request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelTicket(@PathVariable Long id) {
        try {
            ticketService.cancelTicket(id);
            return ResponseEntity.ok().body("{\"message\": \"Hủy vé thành công\"}");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

}
