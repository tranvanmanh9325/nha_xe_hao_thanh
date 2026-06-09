package com.haothanh.booking.service;

import com.haothanh.booking.dto.BusResponseDTO;
import java.util.List;

public interface BusService {
    List<BusResponseDTO> findAllBuses();
}
