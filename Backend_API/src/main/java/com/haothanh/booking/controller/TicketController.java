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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<org.springframework.data.domain.Page<TicketResponseDTO>> getAllTickets(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String search,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Long tripId,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String status,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String dateFilter,
            @org.springframework.data.web.PageableDefault(size = 20, sort = "createdAt", direction = org.springframework.data.domain.Sort.Direction.DESC) 
            org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(ticketService.getAllTickets(search, tripId, status, dateFilter, pageable));
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

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @Valid @RequestBody com.haothanh.booking.dto.TicketUpdateRequestDTO request) {
        try {
            TicketResponseDTO updatedTicket = ticketService.updateTicket(id, request);
            return ResponseEntity.ok(updatedTicket);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}