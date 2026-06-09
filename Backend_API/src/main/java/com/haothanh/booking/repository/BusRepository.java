package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    boolean existsByLicensePlate(String licensePlate);
}
