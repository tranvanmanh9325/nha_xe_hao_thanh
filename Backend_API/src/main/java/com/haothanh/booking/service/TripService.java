package com.haothanh.booking.service;

import com.haothanh.booking.dto.TripResponseDTO;

import java.util.List;

public interface TripService {

    /**
     * Retrieves a list of trips.
     * If a route parameter is provided, it filters trips containing the specified route string (case-insensitive).
     *
     * @param route Optional search term for filtering trips by route
     * @return List of TripResponseDTO
     */
    List<TripResponseDTO> getTrips(String route);
}
