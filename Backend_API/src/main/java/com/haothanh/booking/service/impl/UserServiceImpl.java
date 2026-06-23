package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.ChangePasswordRequestDTO;
import com.haothanh.booking.dto.RegisterRequestDTO;
import com.haothanh.booking.dto.NotificationSettingsDTO;
import com.haothanh.booking.entity.NotificationSettings;
import com.haothanh.booking.entity.User;
import com.haothanh.booking.exception.DuplicateResourceException;
import com.haothanh.booking.exception.ResourceNotFoundException;
import com.haothanh.booking.repository.UserRepository;
import com.haothanh.booking.repository.NotificationSettingsRepository;
import com.haothanh.booking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final NotificationSettingsRepository notificationSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    @SuppressWarnings("null")
    public void changePassword(Long userId, ChangePasswordRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu cũ không chính xác");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public User register(RegisterRequestDTO request) {
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new DuplicateResourceException("Số điện thoại đã được đăng ký");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("CUSTOMER")
                .build();

        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            // Race condition: another thread inserted same phone between check and save
            throw new DuplicateResourceException("Số điện thoại đã được đăng ký");
        }
    }

    @Override
    @SuppressWarnings("null")
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
    }

    @Override
    public NotificationSettingsDTO getNotificationSettings(Long userId) {
        User user = getUserById(userId);
        NotificationSettings settings = user.getNotificationSettings();
        return NotificationSettingsDTO.fromEntity(settings);
    }

    @Override
    @Transactional
    public NotificationSettingsDTO updateNotificationSettings(Long userId, NotificationSettingsDTO request) {
        User user = getUserById(userId);
        NotificationSettings settings = user.getNotificationSettings();

        if (settings == null) {
            settings = NotificationSettings.builder()
                    .user(user)
                    .build();
            user.setNotificationSettings(settings);
        }

        settings.setPushEnabled(request.getPushEnabled() != null ? request.getPushEnabled() : settings.getPushEnabled());
        settings.setEmailEnabled(request.getEmailEnabled() != null ? request.getEmailEnabled() : settings.getEmailEnabled());
        settings.setSmsEnabled(request.getSmsEnabled() != null ? request.getSmsEnabled() : settings.getSmsEnabled());
        settings.setBookingEnabled(request.getBookingEnabled() != null ? request.getBookingEnabled() : settings.getBookingEnabled());
        settings.setPromotionsEnabled(request.getPromotionsEnabled() != null ? request.getPromotionsEnabled() : settings.getPromotionsEnabled());
        settings.setDndEnabled(request.getDndEnabled() != null ? request.getDndEnabled() : settings.getDndEnabled());

        settings = notificationSettingsRepository.save(settings);
        return NotificationSettingsDTO.fromEntity(settings);
    }

    @Override
    @Transactional
    @SuppressWarnings("null")
    public void deleteAccount(Long userId) {
        User user = getUserById(userId);
        
        // Thực hiện Soft Delete / Anonymize data thay vì Hard Delete để tránh lỗi khóa ngoại (Tickets, NotificationQueue)
        user.setPhone("deleted_" + user.getId() + "_" + System.currentTimeMillis());
        user.setEmail("deleted_" + user.getId() + "_" + System.currentTimeMillis() + "@haothanh.vn");
        user.setFullName("Người dùng đã xóa");
        user.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString()));
        
        if (user.getNotificationSettings() != null) {
            notificationSettingsRepository.delete(user.getNotificationSettings());
            user.setNotificationSettings(null);
        }
        
        userRepository.save(user);
    }
}