package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusRequestDTO {
    @NotBlank(message = "Biển số xe không được để trống")
    private String licensePlate;
    
    @NotBlank(message = "Loại xe không được để trống")
    private String busType;
    
    @Min(value = 1, message = "Số ghế phải lớn hơn 0")
    private Integer totalSeats;
    private MultipartFile image;
    private String description;
    private Integer manufactureYear;
    private String color;
}
