package com.haothanh.booking.service.impl;

import com.haothanh.booking.dto.SettingDTO;
import com.haothanh.booking.entity.SystemSetting;
import com.haothanh.booking.repository.SystemSettingRepository;
import com.haothanh.booking.service.SystemSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SystemSettingServiceImpl implements SystemSettingService {

    private final SystemSettingRepository systemSettingRepository;

    @Override
    public SettingDTO getSettings() {
        SystemSetting setting = getOrCreateSetting();
        return mapToDTO(setting);
    }

    @Override
    @Transactional
    public SettingDTO updateSettings(SettingDTO dto) {
        SystemSetting setting = getOrCreateSetting();
        
        setting.setCompanyName(dto.getCompanyName());
        setting.setHotline(dto.getHotline());
        setting.setAddress(dto.getAddress());
        setting.setEmail(dto.getEmail());
        if(dto.getNotifyNewTicket() != null) setting.setNotifyNewTicket(dto.getNotifyNewTicket());
        if(dto.getAutoCancelUnpaid() != null) setting.setAutoCancelUnpaid(dto.getAutoCancelUnpaid());
        
        SystemSetting saved = systemSettingRepository.save(setting);
        return mapToDTO(saved);
    }

    @SuppressWarnings("null")
    private synchronized SystemSetting getOrCreateSetting() {
        List<SystemSetting> settings = systemSettingRepository.findAll();
        if (!settings.isEmpty()) {
            return settings.get(0);
        }
        
        // Return default if empty
        SystemSetting defaultSetting = SystemSetting.builder()
                .companyName("Nhà Xe Hào Thanh")
                .hotline("1900 1234")
                .address("123 Đường ABC, Quận X, TP.HCM")
                .email("contact@haothanh.com")
                .notifyNewTicket(true)
                .autoCancelUnpaid(true)
                .build();
        return systemSettingRepository.save(defaultSetting);
    }

    private SettingDTO mapToDTO(SystemSetting setting) {
        return SettingDTO.builder()
                .companyName(setting.getCompanyName())
                .hotline(setting.getHotline())
                .address(setting.getAddress())
                .email(setting.getEmail())
                .notifyNewTicket(setting.getNotifyNewTicket())
                .autoCancelUnpaid(setting.getAutoCancelUnpaid())
                .build();
    }
}
