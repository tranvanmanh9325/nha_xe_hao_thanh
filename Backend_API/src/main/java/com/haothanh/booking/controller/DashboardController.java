package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.dto.DashboardOverviewDTO;
import com.haothanh.booking.service.DashboardService;
import lombok.RequiredArgsConstructor;
import com.haothanh.booking.dto.RevenueStatisticsDTO;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<DashboardOverviewDTO>> getOverview() {
        DashboardOverviewDTO data = dashboardService.getDashboardOverview();
        return ResponseEntity.ok(ApiResponse.success("Lấy dữ liệu tổng quan thành công", data));
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<RevenueStatisticsDTO>> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) OffsetDateTime endDate) {
        RevenueStatisticsDTO data = dashboardService.getRevenueStatistics(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Lấy dữ liệu thống kê doanh thu thành công", data));
    }
}