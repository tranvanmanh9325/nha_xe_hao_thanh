package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query("SELECT t FROM Ticket t JOIN FETCH t.user JOIN FETCH t.trip ORDER BY t.createdAt DESC")
    List<Ticket> findAllWithDetails();

    @Query("SELECT t.seatCode FROM Ticket t WHERE t.trip.id = :tripId AND t.paymentStatus IN :statuses")
    List<String> findBookedSeatsByTripId(@org.springframework.data.repository.query.Param("tripId") Long tripId, @org.springframework.data.repository.query.Param("statuses") List<String> statuses);
}
