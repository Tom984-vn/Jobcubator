package org.jobcubator.jobcubator.user.dto;

import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserProfile;

public record GetUserProfileResponse(
        String username,
        String email,
        String phoneNumber,
        String birthDate,
        Integer years_of_experience,
        String organization,
        String position,
        String preferredLocation,
        Integer minSalary,
        Integer maxSalary
) {
    public static GetUserProfileResponse fromEntities(User user, UserProfile userProfile) {

        if (userProfile != null) {
            return new GetUserProfileResponse(
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    userProfile.getBirthDate(),
                    userProfile.getYearsOfExperience(),
                    userProfile.getOrganization(),
                    userProfile.getPosition(),
                    userProfile.getPreferredLocation(),
                    userProfile.getMinSalary(),
                    userProfile.getMaxSalary()
            );
        }

        return new GetUserProfileResponse(
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                null,
                -1,
                null,
                null,
                null,
                null,
                null
        );
    }
}