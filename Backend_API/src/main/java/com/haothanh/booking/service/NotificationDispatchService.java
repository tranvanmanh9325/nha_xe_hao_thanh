package com.haothanh.booking.service;

import com.haothanh.booking.entity.NotificationQueue;
import com.haothanh.booking.entity.NotificationSettings;
import com.haothanh.booking.entity.User;
import com.haothanh.booking.enums.NotificationChannel;
import com.haothanh.booking.enums.NotificationType;
import com.haothanh.booking.repository.NotificationQueueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationDispatchService {

    private final NotificationQueueRepository notificationQueueRepository;

    private static final LocalTime DND_START = LocalTime.of(22, 0);
    private static final LocalTime DND_END = LocalTime.of(6, 0);
    private static final ZoneOffset VN_ZONE = ZoneOffset.ofHours(7);

    /**
     * Hàm chính để điều phối gửi thông báo.
     * Sẽ kiểm tra DND. Nếu bị chặn, sẽ đưa vào Queue.
     */
    @Transactional
    public void dispatch(User user, String title, String content, NotificationType type, NotificationChannel channel) {
        if (!isTopicEnabled(user, type) || !isChannelEnabled(user, channel)) {
            log.info("Notification '{}' dropped for user {} due to their notification settings.", title, user.getId());
            return;
        }

        if (shouldQueue(user, type)) {
            queueNotification(user, title, content, type, channel);
            log.info("Notification '{}' queued for user {} due to DND.", title, user.getId());
        } else {
            sendImmediately(user, title, content, type, channel);
        }
    }

    private boolean isTopicEnabled(User user, NotificationType type) {
        NotificationSettings settings = user.getNotificationSettings();
        if (settings == null) return true;

        return switch (type) {
            case SYSTEM -> true; // Hệ thống luôn bật
            case BOOKING -> Boolean.TRUE.equals(settings.getBookingEnabled());
            case PROMOTION -> Boolean.TRUE.equals(settings.getPromotionsEnabled());
        };
    }

    private boolean isChannelEnabled(User user, NotificationChannel channel) {
        NotificationSettings settings = user.getNotificationSettings();
        if (settings == null) return true;

        return switch (channel) {
            case PUSH -> Boolean.TRUE.equals(settings.getPushEnabled());
            case EMAIL -> Boolean.TRUE.equals(settings.getEmailEnabled());
            case SMS -> Boolean.TRUE.equals(settings.getSmsEnabled());
        };
    }

    /**
     * Kiểm tra xem thông báo có nên bị chặn bởi DND và đưa vào hàng đợi không.
     */
    private boolean shouldQueue(User user, NotificationType type) {
        // Chỉ chặn thông báo Khuyến mãi. Thông báo Hệ thống và Booking luôn gửi ngay.
        if (type != NotificationType.PROMOTION) {
            return false;
        }

        NotificationSettings settings = user.getNotificationSettings();
        if (settings == null || Boolean.FALSE.equals(settings.getDndEnabled())) {
            return false;
        }

        // Lấy giờ hiện tại theo UTC+7 (Giờ Việt Nam)
        OffsetDateTime nowInVietnam = OffsetDateTime.now(VN_ZONE);
        LocalTime currentTime = nowInVietnam.toLocalTime();

        // Nằm trong khoảng 22:00 đến 06:00
        return isTimeInDndRange(currentTime);
    }

    private boolean isTimeInDndRange(LocalTime time) {
        if (DND_START.isBefore(DND_END)) {
            // Trường hợp bình thường (ví dụ 10:00 - 14:00) - không áp dụng cho DND 22:00-06:00
            return !time.isBefore(DND_START) && time.isBefore(DND_END);
        } else {
            // Trường hợp qua đêm (22:00 đến 06:00)
            return !time.isBefore(DND_START) || time.isBefore(DND_END);
        }
    }

    private void queueNotification(User user, String title, String content, NotificationType type, NotificationChannel channel) {
        OffsetDateTime now = OffsetDateTime.now(VN_ZONE);
        
        // Dự kiến gửi vào 06:00 sáng hôm nay (nếu hiện tại là 00:00 -> 05:59)
        // Hoặc 06:00 sáng ngày mai (nếu hiện tại là 22:00 -> 23:59)
        OffsetDateTime scheduledTime;
        if (now.toLocalTime().isBefore(DND_END)) {
            scheduledTime = now.with(DND_END).withNano(0);
        } else {
            scheduledTime = now.plusDays(1).with(DND_END).withNano(0);
        }

        NotificationQueue queue = NotificationQueue.builder()
                .user(user)
                .title(title)
                .content(content)
                .type(type)
                .channel(channel)
                .scheduledFor(scheduledTime)
                .build();

        notificationQueueRepository.save(java.util.Objects.requireNonNull(queue));
    }

    public void sendImmediately(User user, String title, String content, NotificationType type, NotificationChannel channel) {
        // Hiện tại dự án chưa có service gửi Push Notification và SMS thật.
        // Chỉ demo gọi một hàm để xử lý.
        
        log.info("Sending {} notification immediately to user {}: {}", channel, user.getId(), title);
        
        // Ví dụ: Gọi EmailService nếu là EMAIL
        if (channel == NotificationChannel.EMAIL) {
            // emailService.sendGenericEmail(user.getEmail(), title, content);
            log.info("Email would be sent to: {}", user.getEmail());
        }
        
        // Push notification logic here...
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void processQueueItem(Long queueId) {
        if (queueId == null) return;
        NotificationQueue item = notificationQueueRepository.findById(queueId).orElse(null);
        if (item == null) return;

        try {
            sendImmediately(item.getUser(), item.getTitle(), item.getContent(), item.getType(), item.getChannel());
            notificationQueueRepository.delete(item);
        } catch (Exception e) {
            log.error("Failed to process queued notification id: {}", item.getId(), e);
            int currentRetries = item.getRetryCount() != null ? item.getRetryCount() : 0;
            if (currentRetries >= 3) {
                log.error("Notification id {} failed 3 times. Removing from queue.", item.getId());
                notificationQueueRepository.delete(item);
            } else {
                item.setRetryCount(currentRetries + 1);
                item.setScheduledFor(OffsetDateTime.now(VN_ZONE).plusDays(1).with(DND_END).withNano(0));
                notificationQueueRepository.save(item);
            }
        }
    }
}