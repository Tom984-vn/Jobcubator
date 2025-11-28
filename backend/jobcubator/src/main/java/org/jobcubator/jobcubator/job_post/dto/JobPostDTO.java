package org.jobcubator.jobcubator.job_post.dto;

import lombok.Builder;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Builder
public record  JobPostDTO(
    UUID id,
    String companyName,
    String title,
    String category,
    String location,
    Integer numberOfVacancies,
    String jobType,
    Instant applicationDeadline,
    Integer minSalary,
    Integer maxSalary,
    UUID companyId,
    String description,
    Set<String> tags
) {
}
