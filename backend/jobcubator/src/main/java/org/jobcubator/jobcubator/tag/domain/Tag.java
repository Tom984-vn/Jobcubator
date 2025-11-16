package org.jobcubator.jobcubator.tag.domain;

import jakarta.persistence.*;
import lombok.*;
import org.jobcubator.jobcubator.course.domain.Course;
import org.jobcubator.jobcubator.job_post.domain.JobPost;

import java.util.Set;
import java.util.HashSet;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tag")
@Builder
public class Tag {

    @Id
    @Column(name = "id", updatable = false, nullable = false, unique = true, insertable = false)
    private Integer id;

    @Column(name = "name", updatable = false, nullable = false, insertable = false, length = 50)
    private String name;

    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    private Set<JobPost> jobPosts = new HashSet<>();

    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    private Set<Course> courses = new HashSet<>();
}
