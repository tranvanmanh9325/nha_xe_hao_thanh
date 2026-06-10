package com.haothanh.booking.service;

import com.haothanh.booking.dto.BusRequestDTO;
import com.haothanh.booking.dto.BusResponseDTO;
import java.util.List;

public interface BusService {
    List<BusResponseDTO> findAllBuses();
    BusResponseDTO getBusById(Long id);
    BusResponseDTO updateBusLayout(Long id, String layoutConfig);
    BusResponseDTO updateBusInfo(Long id, BusRequestDTO request);
    BusResponseDTO createBus(BusRequestDTO request);
}
