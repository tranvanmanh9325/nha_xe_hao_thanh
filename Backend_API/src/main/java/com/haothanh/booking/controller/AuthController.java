package com.haothanh.booking.controller;

import com.haothanh.booking.dto.ApiResponse;
import com.haothanh.booking.dto.AuthRequestDTO;
import com.haothanh.booking.dto.AuthResponseDTO;
import com.haothanh.booking.dto.RegisterRequestDTO;
import com.haothanh.booking.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import com.haothanh.booking.dto.ChangePasswordRequestDTO;
import com.haothanh.booking.dto.UserResponseDTO;
import com.haothanh.booking.service.UserService;
import com.haothanh.booking.security.CustomUserDetails;
import com.haothanh.booking.entity.User;

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

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        // Persist new user (throws DuplicateResourceException if phone exists)
        userService.register(registerRequest);

        // Auto-login after successful registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getPhone(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký thành công", new AuthResponseDTO(jwt)));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO requestDTO,
            @AuthenticationPrincipal CustomUserDetails userPrincipal) {
        
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Người dùng chưa xác thực"));
        }
        
        Long userId = userPrincipal.getId();
        userService.changePassword(userId, requestDTO);
        
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Người dùng chưa xác thực"));
        }

        Long userId = userPrincipal.getId();
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin người dùng thành công", UserResponseDTO.fromEntity(user)));
    }
}