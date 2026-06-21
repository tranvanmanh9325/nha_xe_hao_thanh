package com.haothanh.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

public class SupportRequestDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {
        @NotBlank(message = "Chủ đề không được để trống")
        @Size(max = 100, message = "Chủ đề không được vượt quá 100 ký tự")
        private String topic;

        @NotBlank(message = "Tiêu đề không được để trống")
        @Size(max = 200, message = "Tiêu đề không được vượt quá 200 ký tự")
        private String title;

        @NotBlank(message = "Nội dung chi tiết không được để trống")
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private Long id;
        private Long userId;
        private String userFullName;
        private String topic;
        private String title;
        private String description;
        private String status;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;
    }
}