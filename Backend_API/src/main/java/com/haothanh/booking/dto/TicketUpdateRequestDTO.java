package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketUpdateRequestDTO {
    @NotBlank(message = "Trạng thái thanh toán không được để trống")
    private String paymentStatus;
    
    @NotBlank(message = "Mã ghế không được để trống")
    private String newSeatCode;
}
