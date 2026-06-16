package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.dto.AuthRequestDTO;
import com.haothanh.booking.dto.AuthResponseDTO;
import com.haothanh.booking.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.haothanh.booking.dto.ChangePasswordRequestDTO;
import com.haothanh.booking.service.UserService;
import com.haothanh.booking.security.CustomUserDetails;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> authenticateUser(@Valid @RequestBody AuthRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getPhone(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", new AuthResponseDTO(jwt)));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequestDTO requestDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return ResponseEntity.status(401).body(ApiResponse.error("Người dùng chưa xác thực"));
        }
        
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        
        userService.changePassword(userId, requestDTO);
        
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }
}
