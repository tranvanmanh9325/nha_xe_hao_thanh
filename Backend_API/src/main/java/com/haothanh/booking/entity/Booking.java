package com.haothanh.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(name = "customer_name", nullable = false, length = 255)
    private String customerName;

    @Column(name = "customer_phone", nullable = false, length = 20)
    private String customerPhone;

    @Column(name = "pickup_point", length = 255)
    private String pickupPoint;

    @Column(name = "dropoff_point", length = 255)
    private String dropoffPoint;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "payment_status", nullable = false, length = 50)
    private String paymentStatus;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Builder.Default
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingSeat> seats = new ArrayList<>();
}