package org.jobcubator.jobcubator.company.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jobcubator.jobcubator.user.domain.User;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// TODO: Add tag system to this.

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "companies")
public class Company {
    @Id
    @Column(name = "id", updatable = false, nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "name", length = 100, updatable = true, nullable = false, unique = true)
    private String name;

    @Column(name = "description", updatable = true, columnDefinition = "TEXT")
    private String description;

    @Column(name = "website", length = 150, updatable = true, nullable = false, unique= true)
    private String website;

    @Column(name = "size", length = 50, updatable = true, nullable = false)
    private String size;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CompanyMember> members = new ArrayList<>();

    // @PrePersist
    // public void generateId(){
    //     if (this.id == null){
    //         this.id = UUID.randomUUID();
    //     }
    // }

    @PrePersist
    private void ensureCreatedAt() {
        if(createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public CompanyRole getRoleForUser(UUID userId) {
        return this.members.stream()
                .filter(member -> member.getUser().getId().equals(userId))
                .findFirst()
                .map(CompanyMember::getRole)
                .orElse(null);
    }

    public void addMember(User user, CompanyRole role) {
        CompanyMember member = CompanyMember.builder()
                .company(this)
                .user(user)
                .role(role)
                .build();
        this.members.add(member);
    }

    public User getOwner() {
        return members.stream()
                .filter(m -> m.getRole() == CompanyRole.OWNER)
                .map(CompanyMember::getUser)
                .findFirst()
                .orElse(null);
    }
}
