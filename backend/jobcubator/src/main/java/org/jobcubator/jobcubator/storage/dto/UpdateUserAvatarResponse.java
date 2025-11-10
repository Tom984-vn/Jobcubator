package org.jobcubator.jobcubator.storage.dto;

import lombok.Builder;

@Builder
public record UpdateUserAvatarResponse(String message, String objectKey, String avatarUrl) {
}
