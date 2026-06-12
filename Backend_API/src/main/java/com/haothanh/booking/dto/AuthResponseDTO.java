package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String accessToken;
    private String tokenType;
    
    public AuthResponseDTO(String accessToken) {
        this.accessToken = accessToken;
        this.tokenType = "Bearer";
    }
}
