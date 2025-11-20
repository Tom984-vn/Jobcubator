package org.jobcubator.jobcubator.authentication.api;

import jakarta.validation.Valid;
import org.jobcubator.jobcubator.authentication.dto.AuthResponse;
import org.jobcubator.jobcubator.authentication.dto.RefreshTokenRequest;
import org.jobcubator.jobcubator.authentication.dto.UserLoginRequest;
import org.jobcubator.jobcubator.authentication.dto.UserRegistrationRequest;
import org.jobcubator.jobcubator.authentication.service.UserAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/auth/")
class AuthController {
    private final UserAuthService userAuthService;

    public AuthController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        return ResponseEntity.ok(userAuthService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody UserLoginRequest request) {
        return ResponseEntity.ok(userAuthService.loginUser(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(userAuthService.refreshToken(request));
    }
}
