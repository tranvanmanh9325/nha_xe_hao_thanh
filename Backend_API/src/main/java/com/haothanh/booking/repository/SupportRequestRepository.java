package com.haothanh.booking.repository;

import com.haothanh.booking.entity.SupportRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;public interface SupportRequestRepository extends JpaRepository<SupportRequest, Long> {
    Page<SupportRequest> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}