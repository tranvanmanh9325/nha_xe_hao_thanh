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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.haothanh.booking.security.CustomUserDetails;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TicketResponseDTO>> getAllTickets(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long tripId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String dateFilter,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) 
            Pageable pageable) {
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

    @GetMapping("/me")
    public ResponseEntity<Page<TicketResponseDTO>> getMyTickets(
            @AuthenticationPrincipal CustomUserDetails userPrincipal,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) 
            Pageable pageable) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(ticketService.getMyTickets(userPrincipal.getId(), status, pageable));
    }
}