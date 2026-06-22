package com.haothanh.booking.repository;

import com.haothanh.booking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @Query(value = "SELECT t FROM Ticket t JOIN FETCH t.user JOIN FETCH t.trip " +
           "WHERE (:search IS NULL OR LOWER(t.ticketCode) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(t.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR t.user.phone LIKE CONCAT('%', :search, '%')) " +
           "AND (:tripId IS NULL OR t.trip.id = :tripId) " +
           "AND (:status IS NULL OR t.paymentStatus = :status) " +
           "AND (CAST(:startDate AS timestamp) IS NULL OR t.createdAt >= :startDate) " +
           "AND (CAST(:endDate AS timestamp) IS NULL OR t.createdAt <= :endDate) ",
           countQuery = "SELECT COUNT(t) FROM Ticket t JOIN t.user u JOIN t.trip tr " +
           "WHERE (:search IS NULL OR LOWER(t.ticketCode) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR u.phone LIKE CONCAT('%', :search, '%')) " +
           "AND (:tripId IS NULL OR tr.id = :tripId) " +
           "AND (:status IS NULL OR t.paymentStatus = :status) " +
           "AND (CAST(:startDate AS timestamp) IS NULL OR t.createdAt >= :startDate) " +
           "AND (CAST(:endDate AS timestamp) IS NULL OR t.createdAt <= :endDate) ")
    org.springframework.data.domain.Page<Ticket> findAllWithFilters(
            @org.springframework.data.repository.query.Param("search") String search,
            @org.springframework.data.repository.query.Param("tripId") Long tripId,
            @org.springframework.data.repository.query.Param("status") String status,
            @org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate,
            org.springframework.data.domain.Pageable pageable);

    @Query("SELECT t.seatCode FROM Ticket t WHERE t.trip.id = :tripId AND t.paymentStatus IN :statuses")
    List<String> findBookedSeatsByTripId(@org.springframework.data.repository.query.Param("tripId") Long tripId, @org.springframework.data.repository.query.Param("statuses") List<String> statuses);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.createdAt >= :startDate AND t.createdAt <= :endDate")
    long countTicketsByDateRange(@org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate);

    @Query("SELECT COALESCE(SUM(t.totalPrice), 0) FROM Ticket t WHERE t.createdAt >= :startDate AND t.createdAt <= :endDate")
    java.math.BigDecimal sumRevenueByDateRange(@org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.createdAt >= :startDate AND t.createdAt <= :endDate AND t.paymentStatus = 'CANCELLED'")
    long countCancelledTicketsByDateRange(@org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate);

    @Query(value = "SELECT CAST(created_at AS DATE) as date, COALESCE(SUM(total_price), 0) as revenue " +
                   "FROM tickets " +
                   "WHERE created_at >= :startDate AND created_at <= :endDate AND payment_status = 'PAID' " +
                   "GROUP BY CAST(created_at AS DATE) " +
                   "ORDER BY CAST(created_at AS DATE)", nativeQuery = true)
    List<Object[]> getRevenueByTimeNative(@org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate);

    @Query("SELECT t.trip.route, SUM(t.totalPrice) " +
           "FROM Ticket t " +
           "WHERE t.createdAt >= :startDate AND t.createdAt <= :endDate AND t.paymentStatus = 'PAID' " +
           "GROUP BY t.trip.route")
    List<Object[]> getRevenueByRoute(@org.springframework.data.repository.query.Param("startDate") java.time.OffsetDateTime startDate, @org.springframework.data.repository.query.Param("endDate") java.time.OffsetDateTime endDate);

    long countByTripIdAndPaymentStatusIn(Long tripId, List<String> paymentStatuses);

    @Query("SELECT t.trip.id, COUNT(t) FROM Ticket t WHERE t.trip.id IN :tripIds AND t.paymentStatus IN :statuses GROUP BY t.trip.id")
    List<Object[]> countBookedSeatsByTripIds(@org.springframework.data.repository.query.Param("tripIds") List<Long> tripIds, @org.springframework.data.repository.query.Param("statuses") List<String> statuses);
}