package com.haothanh.booking.config;

import com.haothanh.booking.security.CustomUserDetailsService;
import com.haothanh.booking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.lang.NonNull;
import org.springframework.context.ApplicationContext;

@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthenticationConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    private final ApplicationContext applicationContext;

    @Override
    public void configureClientInboundChannel(@NonNull ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (accessor != null) {
                    if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                        String authHeader = accessor.getFirstNativeHeader("Authorization");
                        if (authHeader != null && authHeader.startsWith("Bearer ") && authHeader.length() > 7) {
                            String token = authHeader.substring(7);
                            if (jwtTokenProvider.validateToken(token)) {
                                Long userId = jwtTokenProvider.getUserIdFromJWT(token);
                                UserDetails userDetails = customUserDetailsService.loadUserById(userId);
                                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities());
                                SecurityContextHolder.getContext().setAuthentication(authentication);
                                accessor.setUser(authentication);
                            } else {
                                log.error("Invalid JWT token over WebSocket");
                                throw new org.springframework.security.access.AccessDeniedException("Invalid JWT token");
                            }
                        } else {
                            log.warn("Missing Authorization Header for WebSocket CONNECT");
                            throw new org.springframework.security.access.AccessDeniedException("Missing Authorization Header");
                        }
                    } else if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                        String destination = accessor.getDestination();
                        if (destination != null && destination.startsWith("/topic/chat/")) {
                            Long sessionId = Long.parseLong(destination.substring(12));
                            org.springframework.security.core.Authentication auth = (org.springframework.security.core.Authentication) accessor.getUser();
                            if (auth == null) {
                                throw new org.springframework.security.access.AccessDeniedException("Not authenticated");
                            }
                            com.haothanh.booking.security.CustomUserDetails userDetails = (com.haothanh.booking.security.CustomUserDetails) auth.getPrincipal();
                            
                            // Get ChatService lazily via ApplicationContext to avoid circular dependencies
                            com.haothanh.booking.service.ChatService chatService = applicationContext.getBean(com.haothanh.booking.service.ChatService.class);
                                
                            chatService.validateSessionAccess(sessionId, userDetails.getId(), auth.getAuthorities());
                        }
                    }
                }
                return message;
            }
        });
    }
}