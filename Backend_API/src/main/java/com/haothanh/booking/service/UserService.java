package com.haothanh.booking.service;

import com.haothanh.booking.dto.ChangePasswordRequestDTO;
import com.haothanh.booking.dto.RegisterRequestDTO;
import com.haothanh.booking.dto.NotificationSettingsDTO;
import com.haothanh.booking.entity.User;

public interface UserService {
    void changePassword(Long userId, ChangePasswordRequestDTO request);

    User register(RegisterRequestDTO request);

    User getUserById(Long userId);
    NotificationSettingsDTO getNotificationSettings(Long userId);
    NotificationSettingsDTO updateNotificationSettings(Long userId, NotificationSettingsDTO request);
}