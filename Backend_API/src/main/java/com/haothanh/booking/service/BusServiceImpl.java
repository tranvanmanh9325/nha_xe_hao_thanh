package com.haothanh.booking.service;

import com.haothanh.booking.dto.BusRequestDTO;
import com.haothanh.booking.dto.BusResponseDTO;
import com.haothanh.booking.entity.Bus;
import com.haothanh.booking.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
@RequiredArgsConstructor
public class BusServiceImpl implements BusService {

    private final BusRepository busRepository;
    private final com.haothanh.booking.repository.TripRepository tripRepository;
    private final Cloudinary cloudinary;

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
        
        String imageUrl = null;
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(request.getImage().getBytes(), ObjectUtils.emptyMap());
                imageUrl = uploadResult.get("secure_url").toString();
            } catch (java.io.IOException e) {
                throw new RuntimeException("Lỗi khi upload ảnh lên Cloudinary", e);
            }
        }
        
        Bus newBus = Bus.builder()
                .licensePlate(request.getLicensePlate())
                .busType(request.getBusType())
                .totalSeats(request.getTotalSeats())
                .imageUrl(imageUrl)
                .description(request.getDescription())
                .manufactureYear(request.getManufactureYear())
                .color(request.getColor())
                .status("Đang hoạt động")
                // layoutConfig will be null initially, or we can set a default empty JSON "{}"
                .build();
                
        Bus savedBus = busRepository.save(java.util.Objects.requireNonNull(newBus));
        return mapToDTO(savedBus);
    }

    @Override
    public BusResponseDTO updateBusInfo(Long id, BusRequestDTO request) {
        if (id == null) {
            throw new IllegalArgumentException("ID xe không được để trống");
        }
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xe"));

        if (!bus.getLicensePlate().equals(request.getLicensePlate())) {
            if (busRepository.existsByLicensePlate(request.getLicensePlate())) {
                throw new RuntimeException("Biển số xe đã tồn tại");
            }
            bus.setLicensePlate(request.getLicensePlate());
        }

        bus.setBusType(request.getBusType());
        bus.setTotalSeats(request.getTotalSeats());
        bus.setDescription(request.getDescription());
        bus.setManufactureYear(request.getManufactureYear());
        bus.setColor(request.getColor());

        if (request.getImage() != null && !request.getImage().isEmpty()) {
            try {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(request.getImage().getBytes(), ObjectUtils.emptyMap());
                bus.setImageUrl(uploadResult.get("secure_url").toString());
            } catch (java.io.IOException e) {
                throw new RuntimeException("Lỗi khi upload ảnh lên Cloudinary", e);
            }
        }

        Bus updatedBus = busRepository.save(bus);
        return mapToDTO(updatedBus);
    }

    @Override
    public void updateStatus(Long id, String status) {
        if (id == null) {
            throw new IllegalArgumentException("ID xe không được để trống");
        }
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin xe"));
        bus.setStatus(status);
        busRepository.save(bus);
    }

    @Override
    public void deleteBus(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID xe không được để trống");
        }
        if (!busRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy thông tin xe");
        }
        if (tripRepository.existsByBusId(id)) {
            throw new RuntimeException("Không thể xóa xe đã từng được lên lịch chuyến đi.");
        }
        busRepository.deleteById(id);
    }

    private BusResponseDTO mapToDTO(Bus bus) {
        return BusResponseDTO.builder()
                .id(bus.getId())
                .licensePlate(bus.getLicensePlate())
                .busType(bus.getBusType())
                .totalSeats(bus.getTotalSeats())
                .status(bus.getStatus())
                .layoutConfig(bus.getLayoutConfig())
                .imageUrl(bus.getImageUrl())
                .description(bus.getDescription())
                .manufactureYear(bus.getManufactureYear())
                .color(bus.getColor())
                .build();
    }
}
