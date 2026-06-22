package com.haothanh.booking.dto;

import com.haothanh.booking.entity.NotificationSettings;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSettingsDTO {
    private Boolean pushEnabled;
    private Boolean emailEnabled;
    private Boolean smsEnabled;
    private Boolean bookingEnabled;
    private Boolean promotionsEnabled;
    private Boolean dndEnabled;

    public static NotificationSettingsDTO fromEntity(NotificationSettings settings) {
        if (settings == null) {
            // Default settings if null
            return NotificationSettingsDTO.builder()
                    .pushEnabled(true)
                    .emailEnabled(true)
                    .smsEnabled(false)
                    .bookingEnabled(true)
                    .promotionsEnabled(false)
                    .dndEnabled(false)
                    .build();
        }
        return NotificationSettingsDTO.builder()
                .pushEnabled(settings.getPushEnabled())
                .emailEnabled(settings.getEmailEnabled())
                .smsEnabled(settings.getSmsEnabled())
                .bookingEnabled(settings.getBookingEnabled())
                .promotionsEnabled(settings.getPromotionsEnabled())
                .dndEnabled(settings.getDndEnabled())
                .build();
    }
}