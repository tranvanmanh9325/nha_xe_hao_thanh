package com.haothanh.booking.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", "dqw8ycwat");
        config.put("api_key", "249549325987834");
        config.put("api_secret", "kcUEsxxVXDhXAML5NAgd9eOiC5o");
        return new Cloudinary(config);
    }
}
