package com.haothanh.booking.service;

import com.haothanh.booking.dto.SupportRequestDTO;
import com.haothanh.booking.entity.SupportRequest;
import com.haothanh.booking.entity.User;
import com.haothanh.booking.repository.SupportRequestRepository;
import com.haothanh.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.haothanh.booking.enums.SupportRequestStatus;
import com.haothanh.booking.exception.ResourceNotFoundException;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final UserRepository userRepository;
    private final SystemSettingService systemSettingService;
    private final EmailService emailService;

    @Transactional
    public SupportRequestDTO.Response createSupportRequest(Long userId, SupportRequestDTO.Create requestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        SupportRequest request = SupportRequest.builder()
                .user(user)
                .topic(requestDTO.getTopic())
                .title(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .status(SupportRequestStatus.PENDING.name())
                .build();

        SupportRequest savedRequest = supportRequestRepository.save(request);

        // Send email notification to admin asynchronously
        String adminEmail = systemSettingService.getSettings().getEmail();
        if (adminEmail != null && !adminEmail.trim().isEmpty()) {
            emailService.sendSupportRequestNotificationToAdmin(adminEmail, savedRequest);
        }

        return mapToResponseDTO(savedRequest);
    }

    @Transactional
    public SupportRequestDTO.Response updateStatus(Long requestId, SupportRequestDTO.UpdateStatus updateStatusDTO) {
        SupportRequest request = supportRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy yêu cầu hỗ trợ"));
        
        request.setStatus(updateStatusDTO.getStatus());
        SupportRequest updatedRequest = supportRequestRepository.save(request);
        return mapToResponseDTO(updatedRequest);
    }

    @Transactional(readOnly = true)
    public Page<SupportRequestDTO.Response> getUserSupportRequests(Long userId, String status, Pageable pageable) {
        if (status == null || status.equalsIgnoreCase("ALL")) {
            return supportRequestRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                    .map(this::mapToResponseDTO);
        }
        return supportRequestRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<SupportRequestDTO.Response> getAllSupportRequests(String status, Pageable pageable) {
        if (status == null || status.equalsIgnoreCase("ALL")) {
            return supportRequestRepository.findAll(pageable)
                    .map(this::mapToResponseDTO);
        }
        return supportRequestRepository.findByStatus(status, pageable)
                .map(this::mapToResponseDTO);
    }

    private SupportRequestDTO.Response mapToResponseDTO(SupportRequest request) {
        return SupportRequestDTO.Response.builder()
                .id(request.getId())
                .userId(request.getUser().getId())
                .userFullName(request.getUser().getFullName())
                .topic(request.getTopic())
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}