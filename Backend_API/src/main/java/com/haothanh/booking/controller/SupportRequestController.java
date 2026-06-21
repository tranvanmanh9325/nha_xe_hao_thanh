package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.dto.SupportRequestDTO;
import com.haothanh.booking.security.CustomUserDetails;
import com.haothanh.booking.service.SupportRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/support-requests")
@RequiredArgsConstructor
public class SupportRequestController {

    private final SupportRequestService supportRequestService;

    @PostMapping
    public ResponseEntity<?> createSupportRequest(@Valid @RequestBody SupportRequestDTO.Create request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Long userId = userDetails.getId();

            SupportRequestDTO.Response response = supportRequestService.createSupportRequest(userId, request);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Gửi yêu cầu hỗ trợ thành công", response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserSupportRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            Long userId = userDetails.getId();

            // Admin can see all, user can see their own
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
            Page<SupportRequestDTO.Response> requests;
            if (isAdmin) {
                requests = supportRequestService.getAllSupportRequests(status, pageable);
            } else {
                requests = supportRequestService.getUserSupportRequests(userId, status, pageable);
            }

            // Thêm các fields pagination vào response payload wrapper
            Map<String, Object> pageData = new java.util.HashMap<>();
            pageData.put("items", requests.getContent());
            pageData.put("currentPage", requests.getNumber());
            pageData.put("totalItems", requests.getTotalElements());
            pageData.put("totalPages", requests.getTotalPages());

            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", pageData));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @Valid @RequestBody SupportRequestDTO.UpdateStatus request) {
        SupportRequestDTO.Response response = supportRequestService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", response));
    }
}