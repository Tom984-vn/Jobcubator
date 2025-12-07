package org.jobcubator.jobcubator.course.dto;

import java.time.Instant;
import java.util.List;

public record CourseDTO(
    Integer id, 
    String title,
    String level,
    String provider,
    String url,
    Instant createdAt,
    List<Integer> tagIds 
) {
}