package org.jobcubator.jobcubator.course.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import org.jobcubator.jobcubator.tag.domain.Tag;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "course")
@Builder
public class Course {
    @Id
    @Column(name = "id", updatable = false, nullable = false, unique = true, insertable = false)
    private Integer id;

    @Column(name = "title", updatable = false, nullable = false, insertable = false, length = 50)
    private String title;

    @Column(name = "level", updatable = false, nullable = false, insertable = false, length = 10)
    private String level; 

    @Column(name = "provider", updatable = false, nullable = false, insertable = false, length = 50)
    private String provider;

    @Column(name = "url", updatable = false, nullable = false, insertable = false, length = 100)
    private String url;

    @Column(name = "created_at", updatable = false, nullable = false, insertable = false)
    private Instant createdAt;

    @ManyToMany
    @JoinTable(
            name = "course_tags",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();

    // Helper methods
    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getCourses().add(this);
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
        tag.getCourses().remove(this);
    }
}
