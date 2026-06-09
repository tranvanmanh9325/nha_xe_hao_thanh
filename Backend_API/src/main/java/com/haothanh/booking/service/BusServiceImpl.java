package com.haothanh.booking.service;

import com.haothanh.booking.dto.BusResponseDTO;
import com.haothanh.booking.entity.Bus;
import com.haothanh.booking.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;

    @Override
    public List<BusResponseDTO> findAllBuses() {
        return busRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BusResponseDTO mapToDTO(Bus bus) {
        return BusResponseDTO.builder()
                .id(bus.getId())
                .licensePlate(bus.getLicensePlate())
                .busType(bus.getBusType())
                .totalSeats(bus.getTotalSeats())
                // Default status as DB schema v1 doesn't have status field
                .status("Đang hoạt động")
                .build();
    }
}
