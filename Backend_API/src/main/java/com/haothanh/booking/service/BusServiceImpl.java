package com.haothanh.booking.service;

import com.haothanh.booking.dto.BusRequestDTO;
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

    @Override
    public BusResponseDTO getBusById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID xe không được để trống");
        }
        return busRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xe"));
    }

    @Override
    public BusResponseDTO updateBusLayout(Long id, String layoutConfig) {
        if (id == null) {
            throw new IllegalArgumentException("ID xe không được để trống");
        }
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xe"));
        
        bus.setLayoutConfig(layoutConfig);
        Bus updatedBus = busRepository.save(bus);
        return mapToDTO(updatedBus);
    }

    @Override
    public BusResponseDTO createBus(BusRequestDTO request) {
        if (busRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new RuntimeException("Biển số xe đã tồn tại");
        }
        
        Bus newBus = Bus.builder()
                .licensePlate(request.getLicensePlate())
                .busType(request.getBusType())
                .totalSeats(request.getTotalSeats())
                // layoutConfig will be null initially, or we can set a default empty JSON "{}"
                .build();
                
        Bus savedBus = busRepository.save(java.util.Objects.requireNonNull(newBus));
        return mapToDTO(savedBus);
    }

    private BusResponseDTO mapToDTO(Bus bus) {
        return BusResponseDTO.builder()
                .id(bus.getId())
                .licensePlate(bus.getLicensePlate())
                .busType(bus.getBusType())
                .totalSeats(bus.getTotalSeats())
                .status("Đang hoạt động")
                .layoutConfig(bus.getLayoutConfig())
                .build();
    }
}
