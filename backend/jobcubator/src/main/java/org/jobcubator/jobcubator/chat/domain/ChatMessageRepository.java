package org.jobcubator.jobcubator.chat.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    Page<ChatMessage> findByApplicationIdOrderBySentAtAsc(Long applicationId, Pageable pageable);

    @Query("SELECT m FROM ChatMessage m WHERE m.application.id = :appId AND m.sender.id != :readerId AND m.readAt IS NULL")
    List<ChatMessage> findUnreadMessagesForUser(@Param("appId") Long applicationId, @Param("readerId") UUID readerId);
}
