package com.haothanh.booking.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class RouteResponseDTO {
    private Long id;
    private String routeCode;
    private String origin;
    private String destination;
    private Double distance;
    private Double estimatedDuration;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
