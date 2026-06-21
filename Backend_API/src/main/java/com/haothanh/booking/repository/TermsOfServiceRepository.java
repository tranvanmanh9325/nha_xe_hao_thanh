package com.haothanh.booking.repository;

import com.haothanh.booking.entity.TermsOfService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TermsOfServiceRepository extends JpaRepository<TermsOfService, Long> {
    List<TermsOfService> findByIsActiveTrueOrderByOrderIndexAsc();
}