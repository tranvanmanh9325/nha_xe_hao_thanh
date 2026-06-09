package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponseDTO {

    private Long id;
    private String route;
    private OffsetDateTime departureTime;
    private BigDecimal basePrice;
    private String status;
    private String licensePlate;
}
