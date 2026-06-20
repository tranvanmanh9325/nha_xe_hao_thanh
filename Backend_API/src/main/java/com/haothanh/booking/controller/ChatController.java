package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.dto.ChatMessageDTO;
import com.haothanh.booking.dto.ChatSessionDTO;
import com.haothanh.booking.security.CustomUserDetails;
import com.haothanh.booking.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // --- REST APIs for Chat Management ---

    @GetMapping("/api/v1/chat/session")
    public ResponseEntity<ApiResponse<ChatSessionDTO>> getOrCreateSession(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Success", chatService.getOrCreateSession(userDetails.getId())));
    }

    @GetMapping("/api/v1/chat/history/{sessionId}")
    public ResponseEntity<ApiResponse<List<ChatMessageDTO>>> getChatHistory(@PathVariable Long sessionId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        chatService.validateSessionAccess(sessionId, userDetails.getId(), userDetails.getAuthorities());
        return ResponseEntity.ok(ApiResponse.success("Success", chatService.getChatHistory(sessionId)));
    }

    @GetMapping("/api/v1/admin/chat/sessions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ChatSessionDTO>>> getAllActiveSessions() {
        return ResponseEntity.ok(ApiResponse.success("Success", chatService.getAllActiveSessions()));
    }

    @PostMapping("/api/v1/admin/chat/sessions/{sessionId}/close")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> closeSession(@PathVariable Long sessionId) {
        chatService.closeSession(sessionId);
        return ResponseEntity.ok(ApiResponse.success("Session closed", null));
    }

    // --- WebSocket Endpoints ---

    /**
     * Client sends message to /app/chat/{sessionId}
     * We broadcast it to /topic/chat/{sessionId}
     */
    @MessageMapping("/chat/{sessionId}")
    public void sendMessage(@DestinationVariable Long sessionId, @Payload ChatMessageDTO chatMessageDTO, java.security.Principal principal) {
        if (principal == null) {
            throw new org.springframework.security.access.AccessDeniedException("User not authenticated");
        }
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken = 
                (org.springframework.security.authentication.UsernamePasswordAuthenticationToken) principal;
        CustomUserDetails userDetails = (CustomUserDetails) authToken.getPrincipal();
        
        chatService.validateSessionAccess(sessionId, userDetails.getId(), authToken.getAuthorities());
        
        boolean isAdmin = authToken.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        Long senderId = isAdmin ? null : userDetails.getId();
        
        // Save to DB
        ChatMessageDTO savedMsg = chatService.saveMessage(sessionId, senderId, chatMessageDTO.getContent());
        // Broadcast
        messagingTemplate.convertAndSend("/topic/chat/" + sessionId, (Object) savedMsg);
    }
}