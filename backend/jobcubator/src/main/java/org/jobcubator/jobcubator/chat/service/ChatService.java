package org.jobcubator.jobcubator.chat.service;

import org.jobcubator.jobcubator.chat.dto.ChatMessageResponse;
import org.jobcubator.jobcubator.chat.dto.ReadReceiptEvent;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface ChatService {
    List<ChatMessageResponse> getChatHistory(User viewer, Long ApplicationId, Pageable pageable);
    ChatMessageResponse saveMessage(Long applicationId, User sender, String content);
    ReadReceiptEvent markMessagesAsRead(Long applicationId, User reader);
}
