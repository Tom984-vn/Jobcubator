package org.jobcubator.jobcubator.authentication.service;

import org.jobcubator.jobcubator.authentication.dto.*;

public interface UserAuthService {
    public AuthResponse registerUser(UserRegistrationRequest request);
    public AuthResponse loginUser(UserLoginRequest request);
    public AuthResponse refreshToken(RefreshTokenRequest request);
}
