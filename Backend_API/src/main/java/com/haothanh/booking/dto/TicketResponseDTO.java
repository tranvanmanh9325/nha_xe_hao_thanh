package com.haothanh.booking.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

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
    private OffsetDateTime departureTime;
    private Long tripId;
}
