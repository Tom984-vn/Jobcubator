package org.jobcubator.jobcubator.chat.dto;

import lombok.Builder;
import org.jobcubator.jobcubator.chat.domain.ChatMessage;

import java.time.Instant;
import java.util.UUID;

@Builder
public record ReadReceiptEvent(
        Long applicationId,
        UUID readerId,
        Instant readAt
) {
}
