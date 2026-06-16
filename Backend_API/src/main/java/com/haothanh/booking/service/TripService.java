package com.haothanh.booking.service;

import com.haothanh.booking.dto.TripResponseDTO;
import com.haothanh.booking.dto.TripSeatMapResponseDTO;

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

    /**
     * Retrieves the seat map for a specific trip.
     *
     * @param tripId The ID of the trip
     * @return TripSeatMapResponseDTO containing seat details
     */
    TripSeatMapResponseDTO getTripSeatMap(Long tripId);

    /**
     * Cancels a trip by setting its status to CANCELLED.
     *
     * @param tripId The ID of the trip to cancel
     */
    void cancelTrip(Long tripId);
}
