package org.jobcubator.jobcubator.authentication.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.authentication.domain.RefreshToken;
import org.jobcubator.jobcubator.authentication.domain.RefreshTokenRepository;
import org.jobcubator.jobcubator.authentication.dto.*;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import static org.jobcubator.jobcubator.authentication.service.JwtTokenServiceImpl.REFRESH_TOKEN_VALIDITY_MILLISECONDS;

@Service
@RequiredArgsConstructor
public class UserAuthServiceImpl implements UserAuthService {

    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;

    @Override
    @Transactional
    public AuthResponse registerUser(UserRegistrationRequest request){
        if(userRepository.existsByEmail(request.email()))
        {
            throw new IllegalArgumentException("Email already exists");
        }

        if(userRepository.existsByUsername(request.username()))
        {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(user);

        return createToken(user.getUsername());
    }

    @Override
    @Transactional
    public AuthResponse loginUser(UserLoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
        );

        return createToken(authentication.getName());
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.refreshToken();

        RefreshToken refreshToken = refreshTokenRepository.findByToken(requestRefreshToken).orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new IllegalArgumentException("Refresh token expired, please login again");
        }

        User user = refreshToken.getUser();

        refreshTokenRepository.delete(refreshToken);

        return createToken(user.getUsername());
    }

    private AuthResponse createToken(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("Username not found"));
        refreshTokenRepository.deleteByUser(user);

        String accessToken = jwtTokenService.generateAccessToken(user.getUsername());
        String refreshToken = jwtTokenService.generateRefreshToken(user.getUsername());

        Instant expiration = Instant.now().plusMillis(REFRESH_TOKEN_VALIDITY_MILLISECONDS); // SHOULD FIX THIS SOON, DUMB IMPLEMENTATION

        RefreshToken refreshTokenNew = new RefreshToken();
        refreshTokenNew.setUser(user);
        refreshTokenNew.setToken(refreshToken);
        refreshTokenNew.setExpiryDate(expiration);

        refreshTokenRepository.save(refreshTokenNew);

        return new AuthResponse(accessToken, refreshToken);
    }
}
