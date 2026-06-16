package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueByRouteDTO {
    private String name; // e.g., "Hà Nội - Nghệ An"
    private double value; // Percentage value for pie chart
    private BigDecimal revenue; // Optional raw revenue value
}