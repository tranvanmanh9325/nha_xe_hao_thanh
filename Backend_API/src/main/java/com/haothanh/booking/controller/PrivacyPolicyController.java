package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.entity.PrivacyPolicy;
import com.haothanh.booking.repository.PrivacyPolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/privacy-policies")
@RequiredArgsConstructor
public class PrivacyPolicyController {

    private final PrivacyPolicyRepository privacyPolicyRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PrivacyPolicy>>> getPrivacyPolicies() {
        List<PrivacyPolicy> policies = privacyPolicyRepository.findByIsActiveTrueOrderByOrderIndexAsc();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách thành công", policies));
    }
}