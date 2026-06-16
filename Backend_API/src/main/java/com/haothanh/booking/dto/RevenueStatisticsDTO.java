package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatisticsDTO {
    private StatItemDTO totalRevenue;
    private StatItemDTO totalTickets;
    private StatItemDTO cancellationRate;
    
    private List<RevenueByTimeDTO> revenueByTime;
    private List<RevenueByRouteDTO> revenueByRoute;
}