package org.jobcubator.jobcubator.user.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false, unique = true)
    private UUID id;

    @Column(name = "full_name", updatable = true, nullable = false)
    private String fullName;

    @Column(name = "username", updatable = true, nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", updatable = true, nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "phone_number", updatable = true, nullable = true, unique = true, length = 20)
    private String phoneNumber;

    @Column(name = "password_hash", updatable = true, nullable = false, length = 100)
    private String passwordHash;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role = Role.CANDIDATE;

// @PrePersist
// private void ensureId() {
//     if (this.id == null) {
//         this.id = UUID.randomUUID();
//     }
// }

    @PrePersist
    private void ensureCreatedAt()
    {
        if(createdAt == null)
        {
            createdAt = Instant.now();
        }
    }

    @OneToOne(
            mappedBy = "user",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private UserProfile userProfile;

    public void setUserProfile(UserProfile userProfile) {
        if (userProfile == null) {
            if (this.userProfile != null) {
                this.userProfile.setUser(null);
            }
        } else {
            userProfile.setUser(this);
        }
        this.userProfile = userProfile;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER")); // I don't have any intended to create role for user because im very suck at handle security things so yeah.
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
