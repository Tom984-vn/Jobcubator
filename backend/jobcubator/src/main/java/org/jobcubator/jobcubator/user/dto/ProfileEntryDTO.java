package org.jobcubator.jobcubator.user.dto;

import org.jobcubator.jobcubator.user.domain.ProfileEntryType;

public record ProfileEntryDTO(
        ProfileEntryType type,
        String organization,
        String title,
        String startDate,
        String endDate,
        String description
) {}
