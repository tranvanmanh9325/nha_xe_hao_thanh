package com.haothanh.booking.repository;

import com.haothanh.booking.entity.TermsOfService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TermsOfServiceRepository extends JpaRepository<TermsOfService, Long> {
    @Query("SELECT t FROM TermsOfService t LEFT JOIN FETCH t.translations WHERE t.isActive = true ORDER BY t.orderIndex ASC")
    List<TermsOfService> findByIsActiveTrueOrderByOrderIndexAsc();
}