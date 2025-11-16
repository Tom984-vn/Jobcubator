package org.jobcubator.jobcubator.storage.dto;

import lombok.Builder;

@Builder
public record UpdateUserCVResponse(String message, String objectKey, String cvUrl) {
}
