package org.jobcubator.jobcubator.user.dto;

import org.jobcubator.jobcubator.user.domain.Gender;

import java.util.List;

public record UpdateUserProfileRequest(String fullName,
                                       Gender gender,
                                       String birthDate,
                                       String phoneNumber,
                                       Integer years_of_experience,
                                       String organization,
                                       String position,
                                       String preferredLocation,
                                       Integer minSalary,
                                       Integer maxSalary,
                                       List<ProfileEntryDTO>history
) {
}
