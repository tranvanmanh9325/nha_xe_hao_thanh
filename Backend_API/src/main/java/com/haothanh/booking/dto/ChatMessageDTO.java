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
public class ChatMessageDTO {
    private Long id;
    private Long sessionId;
    private Long senderId; // null if admin/system
    private String senderName;
    private String content;
    private OffsetDateTime createdAt;
}