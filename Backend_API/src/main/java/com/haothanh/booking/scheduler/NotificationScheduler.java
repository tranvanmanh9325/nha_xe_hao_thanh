package com.haothanh.booking.scheduler;

import com.haothanh.booking.entity.NotificationQueue;
import com.haothanh.booking.repository.NotificationQueueRepository;
import com.haothanh.booking.service.NotificationDispatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationScheduler {

    private final NotificationQueueRepository notificationQueueRepository;
    private final NotificationDispatchService notificationDispatchService;

    // Chạy vào đúng 06:00:00 sáng mỗi ngày theo giờ Việt Nam
    @Scheduled(cron = "0 0 6 * * *", zone = "Asia/Ho_Chi_Minh")
    public void processQueuedNotifications() {
        log.info("Starting to process queued DND notifications...");
        
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.ofHours(7));
        int totalProcessed = 0;
        
        while (true) {
            List<NotificationQueue> queuedItems = notificationQueueRepository.findTop500ByScheduledForLessThanEqualOrderByScheduledForAsc(now);
            
            if (queuedItems.isEmpty()) {
                break;
            }

            for (NotificationQueue item : queuedItems) {
                notificationDispatchService.processQueueItem(item.getId());
                totalProcessed++;
            }
        }
        
        log.info("Finished processing queued notifications. Total processed: {}", totalProcessed);
    }
}