package com.haothanh.booking.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Replaces @EnableGlobalMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(org.springframework.security.config.Customizer.withDefaults()) // Uses WebMvcConfigurer from WebConfig
            .csrf(org.springframework.security.config.Customizer.withDefaults())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow CORS preflight requests
                .requestMatchers("/api/v1/auth/**").permitAll() // Login/Register
                .requestMatchers(HttpMethod.GET, "/api/v1/buses", "/api/v1/buses/**").permitAll() // View buses
                .requestMatchers(HttpMethod.GET, "/api/v1/routes", "/api/v1/routes/**").permitAll() // View routes
                .requestMatchers(HttpMethod.GET, "/api/v1/trips", "/api/v1/trips/**").permitAll() // View trips
                .requestMatchers(HttpMethod.GET, "/api/v1/tickets/seats").permitAll() // View available seats
                .requestMatchers(HttpMethod.POST, "/api/v1/tickets/offline").permitAll() // Book offline tickets
                .requestMatchers("/api/v1/health").permitAll() // Health check
                .anyRequest().authenticated()
            );

        // Add our custom Token based authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
