package com.haothanh.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatSessionDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userPhone;
    private String status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private String lastMessage;
}