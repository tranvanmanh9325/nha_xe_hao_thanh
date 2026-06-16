package com.haothanh.booking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booking_seats")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "seat_number", nullable = false, length = 50)
    private String seatNumber;
}