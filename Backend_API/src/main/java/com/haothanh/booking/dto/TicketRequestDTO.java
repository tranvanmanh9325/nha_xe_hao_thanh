package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketRequestDTO {
    @NotNull(message = "Trip ID không được để trống")
    private Long tripId;
    
    @NotBlank(message = "Mã ghế không được để trống")
    private String seatCode;
    
    @NotBlank(message = "Tên khách hàng không được để trống")
    private String customerName;
    
    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^\\d{10}$", message="SDT ko hop le")
    private String customerPhone;
}
