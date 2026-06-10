package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusRequestDTO {
    private String licensePlate;
    private String busType;
    private Integer totalSeats;
    private MultipartFile image;
    private String description;
    private Integer manufactureYear;
    private String color;
}
