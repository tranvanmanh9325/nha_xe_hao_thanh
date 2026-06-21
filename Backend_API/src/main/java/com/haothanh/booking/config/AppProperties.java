package com.haothanh.booking.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {
    
    private Cors cors = new Cors();
    private Jwt jwt = new Jwt();

    @Getter
    @Setter
    public static class Cors {
        private List<String> allowedOrigins = List.of("http://localhost:3000", "http://localhost:8081");
    }

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
        private int expirationInMs = 86400000;
    }
}