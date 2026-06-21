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

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final UserRepository userRepository;

    @Transactional
    public SupportRequestDTO.Response createSupportRequest(Long userId, SupportRequestDTO.Create requestDTO) {
        User user = userRepository.getReferenceById(userId);

        SupportRequest request = SupportRequest.builder()
                .user(user)
                .topic(requestDTO.getTopic())
                .title(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .status(SupportRequestStatus.PENDING.name())
                .build();

        SupportRequest savedRequest = supportRequestRepository.save(request);
        return mapToResponseDTO(savedRequest);
    }

    @Transactional(readOnly = true)
    public Page<SupportRequestDTO.Response> getUserSupportRequests(Long userId, Pageable pageable) {
        return supportRequestRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::mapToResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<SupportRequestDTO.Response> getAllSupportRequests(Pageable pageable) {
        return supportRequestRepository.findAll(pageable)
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