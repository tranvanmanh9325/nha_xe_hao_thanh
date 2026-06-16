package com.haothanh.booking.repository;

import com.haothanh.booking.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {


    @Query("SELECT bs.seatNumber FROM BookingSeat bs JOIN bs.booking b WHERE b.trip.id = :tripId AND bs.seatNumber IN :seatNumbers")
    List<String> findBookedSeatsByTripAndSeatNumbers(@Param("tripId") Long tripId, @Param("seatNumbers") List<String> seatNumbers);

    @Query("SELECT bs.seatNumber FROM BookingSeat bs JOIN bs.booking b WHERE b.trip.id = :tripId AND b.paymentStatus IN :statuses")
    List<String> findBookedSeatsByTripId(@Param("tripId") Long tripId, @Param("statuses") List<String> statuses);
}