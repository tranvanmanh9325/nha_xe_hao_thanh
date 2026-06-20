package com.haothanh.booking.repository;

import com.haothanh.booking.entity.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findByUserIdAndStatus(Long userId, String status);
    List<ChatSession> findByStatus(String status);
}