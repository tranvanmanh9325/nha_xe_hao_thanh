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
public class RevenueByTimeDTO {
    private String name; // e.g., "T2", "T3" or formatted date "dd/MM"
    private BigDecimal revenue;
}