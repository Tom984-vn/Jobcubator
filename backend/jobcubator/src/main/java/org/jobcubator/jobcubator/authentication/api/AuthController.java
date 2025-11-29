package org.jobcubator.jobcubator.authentication.api;

import jakarta.validation.Valid;
import org.jobcubator.jobcubator.authentication.dto.AuthResponse;
import org.jobcubator.jobcubator.authentication.dto.RefreshTokenRequest;
import org.jobcubator.jobcubator.authentication.dto.UserLoginRequest;
import org.jobcubator.jobcubator.authentication.dto.UserRegistrationRequest;
import org.jobcubator.jobcubator.authentication.service.UserAuthService;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
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

    @DeleteMapping("/logout")
    public ResponseEntity<AuthResponse> logoutUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userAuthService.logoutUser(user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(userAuthService.refreshToken(request));
    }
}
