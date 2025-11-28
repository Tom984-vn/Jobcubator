package org.jobcubator.jobcubator.application.dto;

import java.util.UUID;

public record ApplicationRequest(UUID jobPostId, String coverLetter) {
}
