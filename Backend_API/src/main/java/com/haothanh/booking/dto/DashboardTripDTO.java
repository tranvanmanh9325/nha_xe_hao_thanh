package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.OffsetDateTimeSerializer;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardTripDTO {
    private String code;
    private String route;
    
    @JsonSerialize(using = OffsetDateTimeSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime departureTime;
    
    private Integer bookedSeats;
    private Integer totalSeats;
    private String status;
    private String driver;
}