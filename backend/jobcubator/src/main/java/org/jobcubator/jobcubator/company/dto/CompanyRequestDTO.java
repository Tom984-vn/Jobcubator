package org.jobcubator.jobcubator.company.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CompanyRequestDTO(
    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name must be at most 255 characters")
    String name,

    @Size(max = 255, message = "Website must be at most 255 characters")
    String website,

    @NotNull(message = "Size is required")
    @Min(value = 1, message = "Size must be at least 1")
    Integer size) {
}


