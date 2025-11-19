package org.jobcubator.jobcubator.course.dto;

import java.time.Instant;
import java.util.Optional;

public record CourseFilterDTO(
    
    String title,
    String level,
    String provider,
    
    Integer tagId, 
    
    // Lọc theo Phạm vi ngày tạo (Range Filter)
    Instant dateFrom, 
    Instant dateTo   
) {
    
    
}