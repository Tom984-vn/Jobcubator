package org.jobcubator.jobcubator.job_post.domain;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;
import org.jobcubator.jobcubator.company.domain.Company;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobpost")
public class JobPost {
    @Id
    // @GeneratedValue(strategy = GenerationType.UUID) // Chạy thay cho hàm prepersist để tạo ra id tự động 
    @Column(updatable = false, insertable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY) //Lazy sẽ tối ưu hiệu năng. 
    //trì hoãn việc tải các đối tượng liên quan (ví dụ: Company) cho đến khi bạn thực sự "chạm" vào (truy cập) chúng.
    @JoinColumn(name = "company_id", nullable = false) // mặc định join tới khoá chính của entity đích 
    private Company company;

    @Column(name = "title", length = 100, nullable = false)
    private String title;

  
    @Column(name = "description_path", length = 100, nullable = false)
    private String descriptionPath;

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
}

