package org.jobcubator.jobcubator.authentication.service;

import org.jobcubator.jobcubator.authentication.dto.*;
import org.jobcubator.jobcubator.user.domain.User;

public interface UserAuthService {
    public AuthResponse registerUser(UserRegistrationRequest request);
    public AuthResponse loginUser(UserLoginRequest request);
    public AuthResponse logoutUser(User user);
    public AuthResponse refreshToken(RefreshTokenRequest request);
}
