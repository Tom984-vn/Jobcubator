package org.jobcubator.jobcubator.user.service;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.storage.service.StorageService;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserProfile;
import org.jobcubator.jobcubator.user.domain.UserProfileRepository;
import org.jobcubator.jobcubator.user.domain.UserRepository;
import org.jobcubator.jobcubator.user.dto.GetUserProfileResponse;
import org.jobcubator.jobcubator.user.dto.UpdateUserProfileRequest;
import org.jobcubator.jobcubator.user.dto.UpdateUserProfileResponse;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Override
    @Transactional(readOnly = true)
    public GetUserProfileResponse getUserProfile(User requestUser)
    {
        UserProfile userProfile = userProfileRepository.findById(requestUser.getId()).orElse(null);
        return GetUserProfileResponse.fromEntities(requestUser, userProfile);
    }

    @Override
    @Transactional
    public UpdateUserProfileResponse updateUserProfile(User requestUser, UpdateUserProfileRequest request) {

        UserProfile userProfile = userProfileRepository.findById(requestUser.getId())
                .orElseThrow(() -> new RuntimeException("UserProfile not found for user: " + requestUser.getUsername()));

        if (request.birthDate() != null) {
            userProfile.setBirthDate(request.birthDate());
        }
        if (request.years_of_experience() != null) {
            userProfile.setYearsOfExperience(request.years_of_experience());
        }
        if (request.organization() != null) {
            userProfile.setOrganization(request.organization());
        }
        if (request.position() != null) {
            userProfile.setPosition(request.position());
        }
        if (request.preferredLocation() != null) {
            userProfile.setPreferredLocation(request.preferredLocation());
        }
        if (request.minSalary() != null) {
            userProfile.setMinSalary(request.minSalary());
        }
        if (request.maxSalary() != null) {
            userProfile.setMaxSalary(request.maxSalary());
        }

        UserProfile savedProfile = userProfileRepository.save(userProfile);

        return new UpdateUserProfileResponse(savedProfile.getBirthDate(),
                savedProfile.getYearsOfExperience(),
                savedProfile.getOrganization(),
                savedProfile.getPosition(),
                savedProfile.getPreferredLocation(),
                savedProfile.getMinSalary(),
                savedProfile.getMaxSalary());
    }

    @Override
    @Transactional
    public void saveUserProfileAvatar(User user, String objectKey)
    {
        UserProfile userProfile = userProfileRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("UserProfile not found for user: " + user.getUsername()));

        String pathPrefix = "avatars/";
        String oldObjectKey = userProfile.getAvatarPath();

        if(oldObjectKey != null && !oldObjectKey.equals(objectKey))
        {
            try {
                storageService.deleteFile(oldObjectKey);
            } catch (Exception e) {
                System.err.println("Failed to delete old avatar: " + oldObjectKey + "; Error: " + e.getMessage());
            }
        }
        userProfile.setAvatarPath(objectKey);
    }

    @Override
    public void saveUserProfileCV(User user, String objectKey) {
        UserProfile userProfile = userProfileRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("UserProfile not found for user: " + user.getUsername()));

        String pathPrefix = "cv/";
        String oldObjectKey = userProfile.getCvPath();

        if(oldObjectKey != null && !oldObjectKey.equals(objectKey))
        {
            try {
                storageService.deleteFile(oldObjectKey);
            } catch (Exception e) {
                System.err.println("Failed to delete old avatar: " + oldObjectKey + "; Error: " + e.getMessage());
            }
        }
        userProfile.setCvPath(objectKey);
    }

    @Override
    @Transactional
    public GetUserProfileResponse getUserProfileByUsername(String username) {
        User user =  userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        // TODO: DO THIS LATER IF I HAVE ENOUGH CONFIDENT TO HANDLE THIS SHIT
        return null;
    }
}
