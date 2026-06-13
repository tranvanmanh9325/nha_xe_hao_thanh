package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.OffsetDateTimeSerializer;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripSeatMapResponseDTO {
    private Long tripId;
    private String licensePlate;
    private String busType;
    private String layoutConfig;
    private String route;

    @JsonSerialize(using = OffsetDateTimeSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime departureTime;
    private BigDecimal basePrice;
    private List<String> bookedSeats;
}
