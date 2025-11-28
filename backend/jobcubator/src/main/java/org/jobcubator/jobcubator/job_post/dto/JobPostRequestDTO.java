package org.jobcubator.jobcubator.job_post.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.time.Instant;
import java.util.Set;

@Builder
public record JobPostRequestDTO(
    @NotBlank
    @Size(max = 100)
    String title,

    @Size(max = 50)
    String category,

    @Size(max = 150)
    String location,

    @PositiveOrZero
    Integer numberOfVacancies,

    @NotBlank
    @Size(max = 100)
    String jobType,

    @Future //đảm bảo rằng một giá trị Instant (hoặc Date, LocalDateTime) phải là một thời điểm trong tương lai.
    Instant applicationDeadline,

    @PositiveOrZero
    Integer minSalary,

    @PositiveOrZero
    Integer maxSalary,

    // vì thực thể ghi là ko đc null phần descriptionPath
    String description,
    Set<String> tags
) {
}
