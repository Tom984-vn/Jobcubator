package org.jobcubator.jobcubator.application.dto;

import jakarta.validation.constraints.Size;

import java.util.UUID;

public record ApplicationRequest(UUID jobPostId, @Size(max = 10000) String coverLetter) {
}
