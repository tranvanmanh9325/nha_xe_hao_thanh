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
public class TripSeatMapResponseDTO {
    private Long tripId;
    private String licensePlate;
    private String busType;
    private String layoutConfig;
    private List<String> bookedSeats;
}
