package org.jobcubator.jobcubator.user.service;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.storage.service.StorageService;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserProfile;
import org.jobcubator.jobcubator.user.domain.ProfileEntry;
import org.jobcubator.jobcubator.user.domain.UserProfileRepository;
import org.jobcubator.jobcubator.user.domain.UserRepository;
import org.jobcubator.jobcubator.user.dto.GetUserProfileResponse;
import org.jobcubator.jobcubator.user.dto.UpdateUserProfileRequest;
import org.jobcubator.jobcubator.user.dto.UpdateUserProfileResponse;
import org.jobcubator.jobcubator.user.dto.ProfileEntryDTO;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

        User user = userRepository.findById(requestUser.getId())
                .orElseThrow(() -> new RuntimeException("UserProfile not found for user: " + requestUser.getUsername()));

        if(request.fullName() != null){
            user.setFullName(request.fullName());
        }
        if(request.gender() != null){
            userProfile.setGender(request.gender());
        }
        if(request.phoneNumber() != null){
            user.setPhoneNumber(request.phoneNumber());
        }
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

        if (request.history() != null) {
            userProfile.getHistory().clear();
            for (ProfileEntryDTO dto : request.history()) {
                ProfileEntry entry = ProfileEntry.builder()
                        .type(dto.type())
                        .organization(dto.organization())
                        .title(dto.title())
                        .startDate(dto.startDate())
                        .endDate(dto.endDate())
                        .description(dto.description()).build();
                userProfile.addEntry(entry);
            }
        }

        UserProfile savedProfile = userProfileRepository.save(userProfile);
        userRepository.save(user);

        List<ProfileEntryDTO> historyDtos = savedProfile.getHistory().stream()
                .map(e -> new ProfileEntryDTO(
                        e.getType(),
                        e.getOrganization(),
                        e.getTitle(),
                        e.getStartDate(),
                        e.getEndDate(),
                        e.getDescription()
                ))
                .toList();

        return new UpdateUserProfileResponse(
                user.getFullName(),
                savedProfile.getGender(),
                savedProfile.getBirthDate(),
                user.getPhoneNumber(),
                savedProfile.getYearsOfExperience(),
                savedProfile.getOrganization(),
                savedProfile.getPosition(),
                savedProfile.getPreferredLocation(),
                savedProfile.getMinSalary(),
                savedProfile.getMaxSalary(),
                historyDtos);
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
    @Transactional
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
