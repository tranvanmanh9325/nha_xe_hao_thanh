package com.haothanh.booking.service;

import com.haothanh.booking.dto.ChatMessageDTO;
import com.haothanh.booking.dto.ChatSessionDTO;

import java.util.List;

public interface ChatService {
    ChatSessionDTO getOrCreateSession(Long userId);
    List<ChatSessionDTO> getAllActiveSessions();
    List<ChatMessageDTO> getChatHistory(Long sessionId);
    ChatMessageDTO saveMessage(Long sessionId, Long senderId, String content);
    void closeSession(Long sessionId);
    void validateSessionAccess(Long sessionId, Long userId, java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities);
}