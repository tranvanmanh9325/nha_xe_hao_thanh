package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusResponseDTO {
    private Long id;
    private String busNumber;
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
