package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.ChangePasswordRequestDTO;
import com.haothanh.booking.dto.RegisterRequestDTO;
import com.haothanh.booking.entity.User;
import com.haothanh.booking.exception.DuplicateResourceException;
import com.haothanh.booking.exception.ResourceNotFoundException;
import com.haothanh.booking.repository.UserRepository;
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
}