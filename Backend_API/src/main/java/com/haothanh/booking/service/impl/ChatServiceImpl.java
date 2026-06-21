package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.ChatMessageDTO;
import com.haothanh.booking.dto.ChatSessionDTO;
import com.haothanh.booking.entity.ChatMessage;
import com.haothanh.booking.entity.ChatSession;
import com.haothanh.booking.entity.User;
import com.haothanh.booking.exception.ResourceNotFoundException;
import com.haothanh.booking.repository.ChatMessageRepository;
import com.haothanh.booking.repository.ChatSessionRepository;
import com.haothanh.booking.repository.UserRepository;
import com.haothanh.booking.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ChatServiceImpl implements ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public ChatSessionDTO getOrCreateSession(Long userId) {
        try {
            ChatSession session = chatSessionRepository.findByUserIdAndStatus(userId, "ACTIVE")
                    .orElseGet(() -> {
                        User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với id: " + userId));
                        ChatSession newSession = ChatSession.builder()
                                .user(user)
                                .status("ACTIVE")
                                .build();
                        return chatSessionRepository.saveAndFlush(newSession);
                    });
            return mapToSessionDTO(session);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            ChatSession session = chatSessionRepository.findByUserIdAndStatus(userId, "ACTIVE")
                    .orElseThrow(() -> new RuntimeException("Lỗi khi tạo phiên chat"));
            return mapToSessionDTO(session);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatSessionDTO> getAllActiveSessions() {
        return chatSessionRepository.findByStatus("ACTIVE").stream()
                .map(this::mapToSessionDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getChatHistory(Long sessionId) {
        return chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId).stream()
                .map(this::mapToMessageDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageDTO saveMessage(Long sessionId, Long senderId, String content) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat với id: " + sessionId));
        
        User sender = null;
        if (senderId != null) {
            sender = userRepository.findById(senderId).orElse(null);
        }

        ChatMessage message = ChatMessage.builder()
                .session(session)
                .sender(sender)
                .content(content)
                .build();
        
        message = chatMessageRepository.save(message);
        return mapToMessageDTO(message);
    }

    @Override
    @Transactional
    public void closeSession(Long sessionId) {
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat với id: " + sessionId));
        session.setStatus("CLOSED");
        chatSessionRepository.save(session);
    }

    @Override
    @Transactional(readOnly = true)
    public void validateSessionAccess(Long sessionId, Long userId, java.util.Collection<? extends org.springframework.security.core.GrantedAuthority> authorities) {
        boolean isAdmin = authorities.stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return;

        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiên chat với id: " + sessionId));
        if (!session.getUser().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Không có quyền truy cập phiên chat này");
        }
    }

    private ChatSessionDTO mapToSessionDTO(ChatSession session) {
        return ChatSessionDTO.builder()
                .id(session.getId())
                .userId(session.getUser().getId())
                .userName(session.getUser().getFullName())
                .userPhone(session.getUser().getPhone())
                .status(session.getStatus())
                .createdAt(session.getCreatedAt())
                .updatedAt(session.getUpdatedAt())
                // .lastMessage(could be optimized with a query)
                .build();
    }

    private ChatMessageDTO mapToMessageDTO(ChatMessage message) {
        return ChatMessageDTO.builder()
                .id(message.getId())
                .sessionId(message.getSession().getId())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderName(message.getSender() != null ? message.getSender().getFullName() : "Admin")
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }
}