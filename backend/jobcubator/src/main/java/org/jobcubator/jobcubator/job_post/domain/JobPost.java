package org.jobcubator.jobcubator.job_post.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

import org.jobcubator.jobcubator.company.domain.Company;
import org.jobcubator.jobcubator.tag.domain.Tag;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_posts")
public class JobPost {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Chạy thay cho hàm prepersist để tạo ra id tự động 
    @Column(updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) //Lazy sẽ tối ưu hiệu năng. 
    //trì hoãn việc tải các đối tượng liên quan (ví dụ: Company) cho đến khi bạn thực sự "chạm" vào (truy cập) chúng.
    @JoinColumn(name = "company_id", nullable = false) // mặc định join tới khoá chính của entity đích 
    private Company company;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "benefits", columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "schedule", columnDefinition = "TEXT")
    private String schedule;

    @Column(name = "location", length = 150)
    private String location;

    @Column(name = "number_of_vacancies")
    private Integer numberOfVacancies; 

    @Column(name = "job_type", length = 100, nullable = false)
    private String jobType;

    @Column(name = "application_deadline")
    private Instant applicationDeadline; 

    @Column(name = "min_salary")
    private Integer minSalary;

    @Column(name = "max_salary")
    private Integer maxSalary;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
        @JoinTable(
            name = "post_tags",           // Junction table name
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    // Helper methods
    public void addTag(Tag tag) {
        tags.add(tag);
        tag.getJobPosts().add(this);
    }

    public void removeTag(Tag tag) {
        tags.remove(tag);
        tag.getJobPosts().remove(this);
    }

    public void clearTags() {
        tags.forEach(tag -> tag.getJobPosts().remove(this));
        tags.clear();
    }
}

