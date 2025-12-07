package org.jobcubator.jobcubator.course.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;
import java.util.List;

public record CourseRequestDTO(
    
    @NotBlank(message = "Title is required")
    String title,
    
    @NotBlank(message = "Level is required")
    String level,
    
    @NotBlank(message = "Provider is required")
    String provider,
    
    @NotBlank(message = "URL is required")
    @URL(message = "URL must be a valid link") // Kiểm tra định dạng URL
    String url,
    
    // Dùng để liên kết với các tag khi tạo/cập nhật
    List<Integer> tagIds 
) {
}