package org.jobcubator.jobcubator.job_post.dto;

import java.time.Instant;
import java.util.UUID;

public record JobPostDTO(
    UUID id,
    String title,
    String category,
    String location,
    Integer numberOfVacancies,
    String jobType,
    Instant applicationDeadline,
    Integer minSalary,
    Integer maxSalary,
    UUID companyId,
    String descriptionPath
) {
}
