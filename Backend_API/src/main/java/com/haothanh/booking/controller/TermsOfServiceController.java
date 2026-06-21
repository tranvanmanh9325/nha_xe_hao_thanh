package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.entity.TermsOfService;
import com.haothanh.booking.repository.TermsOfServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/terms-of-service")
@RequiredArgsConstructor
public class TermsOfServiceController {

    private final TermsOfServiceRepository termsOfServiceRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TermsOfService>>> getTermsOfService() {
        List<TermsOfService> terms = termsOfServiceRepository.findByIsActiveTrueOrderByOrderIndexAsc();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", terms));
    }
}