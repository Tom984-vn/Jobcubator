package org.jobcubator.jobcubator.chat.domain;


import jakarta.persistence.*;
import lombok.*;
import org.jobcubator.jobcubator.application.domain.Application;
import org.jobcubator.jobcubator.user.domain.User;

import java.time.Instant;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "sent_at", nullable = false)
    private Instant sentAt;

    @PrePersist
    public void prePersist() {
        if(this.sentAt == null) {
            this.sentAt = Instant.now();
        }
    }

}
