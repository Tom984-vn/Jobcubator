package org.jobcubator.jobcubator.chat.dto;


import jakarta.validation.constraints.Size;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record ChatMessageResponse(Long id,
                                  Long applicationId,
                                  UUID senderId,
                                  String senderName,
                                  @Size(min = 1, max = 2000)
                                  String content,
                                  Instant sentAt,
                                  Instant readAt
                                 ) {
}
