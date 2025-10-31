package org.jobcubator.jobcubator.user.service;

import org.jobcubator.jobcubator.user.dto.UserLoginRequest;
import org.jobcubator.jobcubator.user.dto.UserLoginResponse;
import org.jobcubator.jobcubator.user.dto.UserRegistrationRequest;
import org.jobcubator.jobcubator.user.dto.UserRegistrationResponse;

public interface UserService {
    public UserRegistrationResponse registerNewUser(UserRegistrationRequest request);
    public UserLoginResponse loginUser(UserLoginRequest request);
}
