package org.jobcubator.jobcubator.job_post.dto;

import java.time.Instant;
import java.util.UUID;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record JobPostFilterDTO(
    @Size(max = 100) String title,            
    @Size(max = 100) String companyName,      
    UUID companyId,                           
    @Size(max = 150) String location,         
    @Size(max = 100) String jobType,          
    @PositiveOrZero Integer minSalary,    
    @PositiveOrZero Integer maxSalary,      
    Instant deadlineFrom,                     
    Instant deadlineTo                        
) {}
