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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Replaces @EnableGlobalMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

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
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**", "/ws/**", "/ws-native", "/ws-native/**")) // Disable CSRF for API and WebSocket endpoints
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
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
                .requestMatchers(HttpMethod.GET, "/api/v1/settings").permitAll() // Public settings
                .requestMatchers(HttpMethod.GET, "/api/v1/faqs", "/api/v1/faqs/**").permitAll() // Public FAQs
                .requestMatchers("/ws/**", "/ws-native", "/ws-native/**").permitAll() // WebSocket endpoint (auth via STOMP)
                .anyRequest().authenticated()
            );

        // Add our custom Token based authentication filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    private final com.haothanh.booking.config.AppProperties appProperties;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(appProperties.getCors().getAllowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        CorsConfiguration wsConfiguration = new CorsConfiguration();
        wsConfiguration.setAllowedOriginPatterns(List.of("*"));
        wsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        wsConfiguration.setAllowedHeaders(List.of("*"));
        wsConfiguration.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/ws/**", wsConfiguration);
        source.registerCorsConfiguration("/ws-native", wsConfiguration);
        source.registerCorsConfiguration("/ws-native/**", wsConfiguration);
        
        return source;
    }
}