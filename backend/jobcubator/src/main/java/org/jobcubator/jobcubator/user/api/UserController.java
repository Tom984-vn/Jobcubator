package org.jobcubator.jobcubator.user.api;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.dto.*;
import org.jobcubator.jobcubator.user.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/")
@RequiredArgsConstructor
class UserController {

    private final UserProfileService userProfileService;

    @GetMapping("/me")
    public ResponseEntity<GetUserProfileResponse> getCurrentUser(@AuthenticationPrincipal User user) {

        GetUserProfileResponse response = userProfileService.getUserProfile(user);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UpdateUserProfileResponse> updateUserProfile(@AuthenticationPrincipal User user, @Valid @RequestBody UpdateUserProfileRequest request) {
        UpdateUserProfileResponse response = userProfileService.updateUserProfile(user, request);
        return ResponseEntity.ok(response);
    }


    @PutMapping("/me/avatar")
    public ResponseEntity<String> saveUserAvatar(@AuthenticationPrincipal User user, @RequestBody String objectKey)
    {
        try
        {
            userProfileService.saveUserProfileAvatar(user, objectKey);
            return ResponseEntity.ok("User's avatar updated successfully");
        }catch(Exception e) {
            return ResponseEntity.badRequest().body("Unexpected error while updating user avatar");
        }

    }

    @PutMapping("/me/cv")
    public ResponseEntity<String> saveUserCV(@AuthenticationPrincipal User user, @RequestBody String objectKey)
    {
        try
        {
            userProfileService.saveUserProfileCV(user, objectKey);
            return ResponseEntity.ok("User's cv updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Unexpected error while updating user cv");
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<GetUserProfileResponse> getUserProfileByUsername(
            @PathVariable String username) {
        GetUserProfileResponse response = userProfileService.getUserProfileByUsername(username);
        return ResponseEntity.ok(response);
    }

}
