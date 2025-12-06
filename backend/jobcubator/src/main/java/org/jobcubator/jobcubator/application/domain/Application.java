package org.jobcubator.jobcubator.application.domain;


import jakarta.persistence.*;
import lombok.*;
import org.jobcubator.jobcubator.job_post.domain.JobPost;
import org.jobcubator.jobcubator.user.domain.User;

import java.time.Instant;

@Entity
@Table(name = "applications", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "job_post_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User candidate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_post_id", nullable = false)
    private JobPost jobPost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(nullable = false, updatable = false)
    private Instant appliedAt;
    @PrePersist
    public void prePersist() {
        if(appliedAt == null){
            appliedAt = Instant.now();
        }
    }
}
