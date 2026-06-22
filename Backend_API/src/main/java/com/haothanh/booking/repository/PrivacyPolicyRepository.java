package com.haothanh.booking.repository;

import com.haothanh.booking.entity.PrivacyPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrivacyPolicyRepository extends JpaRepository<PrivacyPolicy, Long> {
    @Query("SELECT p FROM PrivacyPolicy p LEFT JOIN FETCH p.translations WHERE p.isActive = true ORDER BY p.orderIndex ASC")
    List<PrivacyPolicy> findByIsActiveTrueOrderByOrderIndexAsc();
}