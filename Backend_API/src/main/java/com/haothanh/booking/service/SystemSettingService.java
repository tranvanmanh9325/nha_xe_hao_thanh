package com.haothanh.booking.service;

import com.haothanh.booking.dto.SettingDTO;

public interface SystemSettingService {
    SettingDTO getSettings();
    SettingDTO updateSettings(SettingDTO settingDTO);
}
