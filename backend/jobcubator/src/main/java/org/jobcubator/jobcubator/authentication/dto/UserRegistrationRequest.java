package org.jobcubator.jobcubator.authentication.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegistrationRequest(

        @NotBlank(message = "Username is required")
        @Size(min = 8, max = 32, message = "Username must be between 8 and 32 characters")
        @Pattern(
                regexp = "^[a-zA-Z0-9]+$",
                message = "Username can only contain letters and numbers"
        )
        String username,


        @NotBlank(message = "Email is required")
        @Email(message = "Please provide a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be at least 8 characters long")
        @Pattern(
                regexp = "^\\S+$",
                message = "Password cannot contain spaces"
        )
        String password

) {}
