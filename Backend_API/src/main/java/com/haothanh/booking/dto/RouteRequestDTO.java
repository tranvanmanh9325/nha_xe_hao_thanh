package com.haothanh.booking.dto;

import lombok.Data;

@Data
public class RouteRequestDTO {
    private String routeCode;
    private String origin;
    private String destination;
    private Double distance;
    private Double estimatedDuration;
    private String status;
}
