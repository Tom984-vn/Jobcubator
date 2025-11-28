package org.jobcubator.jobcubator.chat.api;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.chat.dto.ChatMessageResponse;
import org.jobcubator.jobcubator.chat.service.ChatServiceImpl;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class ChatController {
    private final ChatServiceImpl chatService;

    @GetMapping("/api/applications/{applicationId}/chat")
    public ResponseEntity<List<ChatMessageResponse>> findByApplicationIdOrderBySendAtAsc(
            @PathVariable Long applicationId,
            @AuthenticationPrincipal User user,
            Pageable pageable) {
        return ResponseEntity.ok(chatService.getChatHistory(user, applicationId, pageable));
    }

    @MessageMapping("/chat/{applicationId}")
    @SendTo("/topic/application/{applicationId}")
    public ChatMessageResponse sendMessage(
            @DestinationVariable Long applicationId,
            @Payload
            @Size(min = 1, max = 2000)
            @NotBlank String content,
            @AuthenticationPrincipal User user
    ){
        return chatService.saveMessage(applicationId, user, content);
    }

}
