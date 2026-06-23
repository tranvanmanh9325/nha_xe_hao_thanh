package com.haothanh.booking.repository;

import com.haothanh.booking.entity.NotificationQueue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.OffsetDateTime;
import java.util.List;

public interface NotificationQueueRepository extends JpaRepository<NotificationQueue, Long> {

    // Lấy các thông báo đã đến hạn gửi (thời điểm dự kiến gửi <= thời điểm hiện tại), tối đa 500 dòng/lần
    List<NotificationQueue> findTop500ByScheduledForLessThanEqualOrderByScheduledForAsc(OffsetDateTime now);
}