package org.jobcubator.jobcubator.user.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @Column(name = "id", updatable = false, nullable = false, unique = true)
    private UUID id;

    @Column(name = "username", updatable = true, nullable = false, unique = true)
    private String username;

    @Column(name = "email", updatable = true, nullable = false, unique = true)
    private String email;

    @Column(name = "password", updatable = true, nullable = false)
    private String password;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
}
