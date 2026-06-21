package com.haothanh.booking.service;

import com.haothanh.booking.entity.SupportRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${MAIL_FROM:noreply@haothanh.com}")
    private String mailFrom;

    @Async
    public void sendSupportRequestNotificationToAdmin(String adminEmail, SupportRequest request) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(mailFrom);
            message.setTo(adminEmail);
            message.setSubject("Yêu cầu hỗ trợ mới: " + request.getTopic() + " - " + request.getTitle());
            
            String content = String.format(
                "Xin chào Admin,\n\n" +
                "Hệ thống vừa nhận được một yêu cầu hỗ trợ mới từ khách hàng.\n\n" +
                "THÔNG TIN YÊU CẦU:\n" +
                "- Người gửi: %s\n" +
                "- Chủ đề: %s\n" +
                "- Tiêu đề: %s\n" +
                "- Nội dung chi tiết:\n%s\n\n" +
                "Vui lòng đăng nhập vào trang Quản trị Web (Admin) để xem và xử lý yêu cầu này.\n\n" +
                "Trân trọng,\n" +
                "Hệ thống Quản lý Nhà xe Hào Thanh",
                request.getUser().getFullName(),
                request.getTopic(),
                request.getTitle(),
                request.getDescription()
            );

            message.setText(content);
            mailSender.send(message);
            log.info("Successfully sent support request notification email to admin: {}", adminEmail);
        } catch (Exception e) {
            log.error("Failed to send support request notification email to admin: {}", adminEmail, e);
        }
    }
}