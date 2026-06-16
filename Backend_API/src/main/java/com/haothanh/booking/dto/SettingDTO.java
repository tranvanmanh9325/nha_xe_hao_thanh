package com.haothanh.booking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingDTO {
    
    @NotBlank(message = "Tên nhà xe không được để trống")
    private String companyName;
    
    @NotBlank(message = "Hotline không được để trống")
    private String hotline;
    
    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;
    
    @NotBlank(message = "Email không được để trống")
    private String email;
    
    private Boolean notifyNewTicket;
    private Boolean autoCancelUnpaid;
}
