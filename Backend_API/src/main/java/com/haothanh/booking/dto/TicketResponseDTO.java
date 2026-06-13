package com.haothanh.booking.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.OffsetDateTimeSerializer;

@Data
@Builder
public class TicketResponseDTO {
    private Long id;
    private String ticketCode;
    private String seatCode;
    private BigDecimal totalPrice;
    private String paymentStatus;
    private String customerName;
    private String customerPhone;
    private String route;

    @JsonSerialize(using = OffsetDateTimeSerializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private OffsetDateTime departureTime;
    private Long tripId;
}
