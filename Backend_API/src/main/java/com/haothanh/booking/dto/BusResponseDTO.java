package com.haothanh.booking.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BusResponseDTO {
    private Long id;
    private String licensePlate;
    private String busType;
    private Integer totalSeats;
    private String status;
    private String layoutConfig;
    private String imageUrl;
    private String description;
    private Integer manufactureYear;
    private String color;
}
