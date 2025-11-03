package org.jobcubator.jobcubator.user.api;

import jakarta.validation.Valid;
import org.jobcubator.jobcubator.user.dto.UserLoginRequest;
import org.jobcubator.jobcubator.user.dto.UserLoginResponse;
import org.jobcubator.jobcubator.user.dto.UserRegistrationRequest;
import org.jobcubator.jobcubator.user.dto.UserRegistrationResponse;
import org.jobcubator.jobcubator.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/user/")
class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponse> register(@Valid @RequestBody UserRegistrationRequest userRegistrationRequest) {
        UserRegistrationResponse userRegistrationResponse = userService.registerNewUser(userRegistrationRequest);
        return ResponseEntity.ok(userRegistrationResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@Valid @RequestBody UserLoginRequest userLoginRequest) {
        UserLoginResponse userLoginResponse = userService.loginUser(userLoginRequest);
        return ResponseEntity.ok(userLoginResponse);
    }
}
