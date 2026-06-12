package com.haothanh.booking.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Data
public class RouteRequestDTO {
    @NotBlank(message = "Mã tuyến không được để trống")
    private String routeCode;
    
    @NotBlank(message = "Điểm đi không được để trống")
    private String origin;
    
    @NotBlank(message = "Điểm đến không được để trống")
    private String destination;
    
    @Min(value = 0, message = "Khoảng cách phải lớn hơn 0")
    private Double distance;
    private Double estimatedDuration;
    private String status;
}
