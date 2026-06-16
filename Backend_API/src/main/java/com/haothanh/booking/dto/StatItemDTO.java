package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatItemDTO {
    private String label;
    private Object value;
    private Double trend;
    private String trendLabel;
}