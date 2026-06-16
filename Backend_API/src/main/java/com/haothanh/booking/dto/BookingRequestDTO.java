package com.haothanh.booking.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BookingRequestDTO {

    @NotNull(message = "Trip ID is required")
    private Long tripId;

    @NotEmpty(message = "Customer name is required")
    private String customerName;

    @NotEmpty(message = "Customer phone is required")
    private String customerPhone;

    private String pickupPoint;
    private String dropoffPoint;
    private String notes;

    @NotEmpty(message = "Payment status is required")
    private String paymentStatus;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalPrice;

    @NotEmpty(message = "Seat numbers are required")
    private List<String> seatNumbers;
}