package org.jobcubator.jobcubator.chat.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByApplicationIdOrderBySendAtAsc(Long applicationId, Pageable pageable);
}
