package com.haothanh.booking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String hotline;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String email;

    @Column(name = "notify_new_ticket")
    private Boolean notifyNewTicket;

    @Column(name = "auto_cancel_unpaid")
    private Boolean autoCancelUnpaid;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;
}
