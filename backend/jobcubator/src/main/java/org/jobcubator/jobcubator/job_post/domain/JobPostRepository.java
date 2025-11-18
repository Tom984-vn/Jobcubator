package org.jobcubator.jobcubator.job_post.domain;
import org.jobcubator.jobcubator.tag.domain.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;
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

    Page<JobPost>findAllByOrderByNumberOfVacanciesDesc(Pageable pageable);

    Page<JobPost>findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT DISTINCT jp FROM JobPost jp JOIN jp.tags t WHERE t.name = :tagNames")
    Page<JobPost> findByTagName(@Param("tagName") String tagNames, Pageable pageable);

    // Find job posts by any tag matches
    @Query("SELECT DISTINCT jp FROM JobPost jp JOIN jp.tags t WHERE t.name IN :tagNames")
    Page<JobPost> findByAnyTag(@Param("tagNames") Set<String> tagNames, Pageable pageable);

    // Find job posts by all tags must match
    @Query("SELECT jp FROM JobPost jp JOIN jp.tags t where t.name IN :tagNames " +
    "GROUP BY jp.id HAVING COUNT (DISTINCT t.name) = :tagCount")
    Page<JobPost> findByAllTags(@Param("tagNames") Set<String> tagNames,
                                @Param("tagCount") long tagCount,
                                Pageable pageable);

    // Get all tags for a job post
    @Query("SELECT t FROM JobPost jp JOIN jp.tags t WHERE jp.id = :jobId")
    Set<Tag> findTagByJobId(@Param("jobId") UUID jobId);
}
