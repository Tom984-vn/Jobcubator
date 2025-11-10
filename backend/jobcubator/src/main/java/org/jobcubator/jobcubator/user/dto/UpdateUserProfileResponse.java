package org.jobcubator.jobcubator.user.dto;

public record UpdateUserProfileResponse(String birthDate,
                                        Integer years_of_experience,
                                        String organization,
                                        String position,
                                        String preferredLocation,
                                        Integer minSalary,
                                        Integer maxSalary){
}
