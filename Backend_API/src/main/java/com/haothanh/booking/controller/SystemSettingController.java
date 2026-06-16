package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.dto.SettingDTO;
import com.haothanh.booking.service.SystemSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/settings")
@RequiredArgsConstructor
public class SystemSettingController {

    private final SystemSettingService systemSettingService;

    @GetMapping
    public ResponseEntity<ApiResponse<SettingDTO>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("Lấy cấu hình thành công", systemSettingService.getSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SettingDTO>> updateSettings(@Valid @RequestBody SettingDTO settingDTO) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật cấu hình thành công", systemSettingService.updateSettings(settingDTO)));
    }
}
