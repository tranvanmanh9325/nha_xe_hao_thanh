package com.haothanh.booking.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final RedissonClient redissonClient;

    /**
     * Attempts to book a specific seat using Redis Distributed Lock.
     * This ensures that in a multi-instance (High Concurrency) environment,
     * only one request can successfully acquire the lock for a specific seat at a time,
     * effectively preventing the Race Condition (Double-booking) problem.
     *
     * @param busId  The ID of the bus.
     * @param seatId The ID of the seat to book.
     * @param userId The ID of the user attempting to book.
     * @return true if booking is successful, false otherwise.
     */
    public boolean bookSeatWithRedisLock(String busId, String seatId, String userId) {
        String lockKey = "lock:seat:" + busId + ":" + seatId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            // Attempt to acquire the lock. 
            // Wait time: 3 seconds (how long to wait for the lock).
            // Lease time: 10 seconds (how long to hold the lock before auto-release to prevent deadlocks).
            boolean isLocked = lock.tryLock(3, 10, TimeUnit.SECONDS);

            if (isLocked) {
                try {
                    log.info("Lock acquired for seat: {} by user: {}", seatId, userId);
                    
                    // Step 1: Check database if seat is already booked (Double-check after acquiring lock)
                    // Step 2: If available, proceed with database update (e.g., set status to 'BOOKED')
                    // Step 3: Save booking transaction record

                    log.info("Successfully booked seat: {} for user: {}", seatId, userId);
                    return true;
                } finally {
                    // Always ensure lock is released when operations are done
                    if (lock.isHeldByCurrentThread()) {
                        lock.unlock();
                    }
                }
            } else {
                log.warn("Could not acquire lock for seat: {} by user: {}. Seat might be currently being booked by someone else.", seatId, userId);
                return false;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.error("Thread interrupted while trying to acquire lock for seat: {}", seatId, e);
            return false;
        }
    }


    /*
     * ALTERNATIVE APPROACH: JPA Pessimistic Locking
     * 
     * In cases where we want to handle the lock directly at the Database level without Redis:
     * We can use JPA's @Lock(LockModeType.PESSIMISTIC_WRITE) in the Repository.
     * 
     * @Repository
     * public interface SeatRepository extends JpaRepository<Seat, Long> {
     *     @Lock(LockModeType.PESSIMISTIC_WRITE)
     *     @QueryHints({@QueryHint(name = "javax.persistence.lock.timeout", value = "3000")})
     *     @Query("SELECT s FROM Seat s WHERE s.id = :seatId")
     *     Optional<Seat> findByIdWithPessimisticLock(@Param("seatId") Long seatId);
     * }
     * 
     * Pros of JPA Pessimistic Lock: 
     * - Simpler, no extra infrastructure (Redis) needed.
     * - Guarantees absolute consistency at DB row level.
     * 
     * Cons: 
     * - Can cause DB bottlenecks under extremely high traffic since connections are blocked.
     * - Might lead to connection pool exhaustion if transactions are long.
     * 
     * Redis Lock is generally preferred for High-Traffic scenarios because it offloads the blocking 
     * mechanism from the main database to an in-memory datastore (Redis), keeping DB connections free.
     */
}
