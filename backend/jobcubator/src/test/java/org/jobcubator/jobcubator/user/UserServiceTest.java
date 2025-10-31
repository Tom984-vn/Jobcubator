package org.jobcubator.jobcubator.user;

// Imports for your specific packages
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserRepository;
import org.jobcubator.jobcubator.user.dto.UserLoginRequest;
import org.jobcubator.jobcubator.user.dto.UserLoginResponse;
import org.jobcubator.jobcubator.user.dto.UserRegistrationRequest;
import org.jobcubator.jobcubator.user.dto.UserRegistrationResponse;
import org.jobcubator.jobcubator.user.service.UserServiceImpl;

// Imports for Mockito/JUnit
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit test for UserServiceImpl.
 * This test mocks the dependencies (UserRepository, PasswordEncoder)
 * to test the service logic in isolation.
 */
@ExtendWith(MockitoExtension.class) // Enables Mockito
class UserServiceTest {

    @Mock // We create a "fake" version of the repository
    private UserRepository userRepository;

    @Mock // We create a "fake" password encoder
    private PasswordEncoder passwordEncoder;

    @InjectMocks // This creates a real UserServiceImpl and injects our mocks into it
    private UserServiceImpl userService; // Assuming your class is UserServiceImpl

    // You might need to change UserServiceImpl to UserService if that's your class name
    // @InjectMocks
    // private UserService userService;

    private User testUser;
    private final String HASHED_PASSWORD = "hashedPassword123abc";

    @BeforeEach
    void setUp() {
        // Create a re-usable User object for our tests
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword(HASHED_PASSWORD); // The user in DB has a hashed password
    }

    // --- Tests for loginUser ---

    @Test
    void loginUser_whenCredentialsAreCorrect_shouldReturnSuccessResponse() {
        // --- Given (Arrange) ---
        UserLoginRequest loginRequest = new UserLoginRequest("testuser", "rawPassword123");

        // 1. Mock the repository to find the user
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));

        // 2. Mock the password encoder to return true
        when(passwordEncoder.matches("rawPassword123", HASHED_PASSWORD))
                .thenReturn(true);

        // --- When (Act) ---
        UserLoginResponse response = userService.loginUser(loginRequest);

        // --- Then (Assert) ---
        assertThat(response).isNotNull();
        assertThat(response.message()).isEqualTo("User logged in successfully");

        // Verify findByUsername was called
        verify(userRepository, times(1)).findByUsername("testuser");
        // Verify passwordEncoder.matches was called
        verify(passwordEncoder, times(1)).matches("rawPassword123", HASHED_PASSWORD);
    }

    @Test
    void loginUser_whenUserNotFound_shouldThrowException() {
        // --- Given (Arrange) ---
        UserLoginRequest loginRequest = new UserLoginRequest("nonexistentuser", "rawPassword123");

        // 1. Mock the repository to return empty
        when(userRepository.findByUsername("nonexistentuser"))
                .thenReturn(Optional.empty());

        // --- When (Act) & Then (Assert) ---
        assertThatThrownBy(() -> {
            userService.loginUser(loginRequest);
        })
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid username or password");

        // Verify passwordEncoder.matches was NEVER called
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void loginUser_whenPasswordIsIncorrect_shouldThrowException() {
        // --- Given (Arrange) ---
        UserLoginRequest loginRequest = new UserLoginRequest("testuser", "wrongPassword");

        // 1. Mock the repository to find the user
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(testUser));

        // 2. Mock the password encoder to return FALSE
        when(passwordEncoder.matches("wrongPassword", HASHED_PASSWORD))
                .thenReturn(false);

        // --- When (Act) & Then (Assert) ---
        assertThatThrownBy(() -> {
            userService.loginUser(loginRequest);
        })
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Invalid username or password");

        // Verify passwordEncoder.matches WAS called
        verify(passwordEncoder, times(1)).matches("wrongPassword", HASHED_PASSWORD);
    }


    // --- Tests for registerNewUser (from previous steps) ---

    @Test
    void registerNewUser_whenDetailsAreValid_shouldSaveUser() {
        // --- Given (Arrange) ---
        UserRegistrationRequest request = new UserRegistrationRequest(
                "newuser",
                "ValidPass123",
                "new@example.com"
        );

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("ValidPass123")).thenReturn("hashedNewPassword");

        // --- When (Act) ---
        UserRegistrationResponse response = userService.registerNewUser(request);

        // --- Then (Assert) ---
        assertThat(response).isNotNull();
        assertThat(response.message()).isEqualTo("User registered successfully");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerNewUser_whenUsernameIsTaken_shouldThrowException() {
        // --- Given (Arrange) ---
        UserRegistrationRequest request = new UserRegistrationRequest(
                "takenUser",
                "ValidPass123",
                "new@example.com"
        );

        when(userRepository.existsByUsername("takenUser")).thenReturn(true);

        // --- When (Act) & Then (Assert) ---
        assertThatThrownBy(() -> {
            userService.registerNewUser(request);
        })
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Username is already in use");

        verify(userRepository, never()).save(any(User.class));
    }
}
