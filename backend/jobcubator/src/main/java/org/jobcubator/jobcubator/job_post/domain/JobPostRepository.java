package org.jobcubator.jobcubator.job_post.domain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;
public interface JobPostRepository extends JpaRepository<JobPost, UUID>,JpaSpecificationExecutor<JobPost> {
    /**
     * Tìm tất cả các JobPost thuộc về một Company, có phân trang.
     * @param companyId UUID của công ty
     * @param pageable  Thông tin phân trang
     * @return Một trang (Page) chứa các JobPost
     */
    Page<JobPost> findByCompany_Id(UUID companyId, Pageable pageable);

    /**
     * Tìm tất cả các JobPost (theo tên) thuộc về một Company, có phân trang.
     * @param companyName tên của công ty
     * @param pageable  Thông tin phân trang
     * @return Một trang (Page) chứa các JobPost
     */
    Page<JobPost> findByCompany_NameContainingIgnoreCase(String companyName, Pageable pageable);


}
