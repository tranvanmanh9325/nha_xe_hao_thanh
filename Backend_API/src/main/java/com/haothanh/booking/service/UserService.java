package com.haothanh.booking.service;

import com.haothanh.booking.dto.ChangePasswordRequestDTO;

public interface UserService {
    void changePassword(Long userId, ChangePasswordRequestDTO request);
}
