package com.haothanh.booking.repository;

import com.haothanh.booking.entity.PrivacyPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrivacyPolicyRepository extends JpaRepository<PrivacyPolicy, Long> {
    List<PrivacyPolicy> findByIsActiveTrueOrderByOrderIndexAsc();
}