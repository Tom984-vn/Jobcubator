package org.jobcubator.jobcubator.user.service;

import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.dto.GetUserProfileResponse;
import org.jobcubator.jobcubator.user.dto.UpdateUserProfileRequest;
import org.jobcubator.jobcubator.user.dto.UpdateUserProfileResponse;

import java.util.UUID;

public interface UserProfileService {
    UpdateUserProfileResponse updateUserProfile(User user, UpdateUserProfileRequest request);
    GetUserProfileResponse getUserProfile(User user);
    GetUserProfileResponse getUserProfileByUsername(String username);
    public void SaveUserProfileAvatar(User user, String objectKey);
}
