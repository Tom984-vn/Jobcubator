package org.jobcubator.jobcubator.user.dto;

import org.jobcubator.jobcubator.user.domain.Gender;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserProfile;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record GetUserProfileResponse(
        UUID userId,
        String fullName,
        String username,
        String email,
        String phoneNumber,
        Gender gender,
        String birthDate,
        Integer years_of_experience,
        String organization,
        String position,
        String preferredLocation,
        Integer minSalary,
        Integer maxSalary,
        List<ProfileEntryDTO> history
) {
    public static GetUserProfileResponse fromEntities(User user, UserProfile userProfile) {

        if (userProfile != null) {
            List<ProfileEntryDTO> historyDtos = userProfile.getHistory() != null ?
                    userProfile.getHistory().stream()
                            .map(e -> new ProfileEntryDTO(e.getType(), e.getOrganization(), e.getTitle(), e.getStartDate(), e.getEndDate(), e.getDescription()))
                            .toList() : Collections.emptyList();

            return new GetUserProfileResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    userProfile.getGender(),
                    userProfile.getBirthDate(),
                    userProfile.getYearsOfExperience(),
                    userProfile.getOrganization(),
                    userProfile.getPosition(),
                    userProfile.getPreferredLocation(),
                    userProfile.getMinSalary(),
                    userProfile.getMaxSalary(),
                    historyDtos
            );
        }

        return new GetUserProfileResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                Gender.NA,
                null,
                -1,
                null,
                null,
                null,
                null,
                null,
                Collections.emptyList()
        );
    }
}