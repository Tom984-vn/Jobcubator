package org.jobcubator.jobcubator.user.service;

import org.jobcubator.jobcubator.user.dto.UserLoginRequest;
import org.jobcubator.jobcubator.user.dto.UserLoginResponse;
import org.jobcubator.jobcubator.user.dto.UserRegistrationRequest;
import org.jobcubator.jobcubator.user.dto.UserRegistrationResponse;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserRegistrationResponse registerNewUser(UserRegistrationRequest request){
        User newUser = new User();
        if(userRepository.existsByUsername(request.username()))
        {
            throw new IllegalArgumentException("Username is already in use");
        }

        if(userRepository.existsByEmail(request.email()))
        {
            throw new IllegalArgumentException("Email is already in use");
        }
        newUser.setUsername(request.username());
        newUser.setEmail(request.email());
        newUser.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(newUser);
        return new UserRegistrationResponse("User registered successfully");
    }

    @Override
    public UserLoginResponse loginUser(UserLoginRequest request){
        Optional<User> userOptional = userRepository.findByUsername(request.username());
        if(userOptional.isPresent())
        {
            User user = userOptional.get();

            if(passwordEncoder.matches(request.password(), user.getPassword()))
            {
                return new UserLoginResponse("User logged in successfully");
            }
        }
        throw new IllegalArgumentException("Invalid username or password");
    }

}
