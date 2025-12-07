package org.jobcubator.jobcubator.application.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByCandidateIdAndJobPostId(UUID candidateId, UUID jobPostId);

    List<Application> findByJobPostId(UUID jobPostId);

    List<Application> findByCandidateId(UUID candidateId);

    @Query("""
        SELECT a FROM Application a
        JOIN FETCH a.candidate
        JOIN FETCH a.jobPost jp
        JOIN FETCH jp.company
        WHERE a.id = :id
    """)
    Optional<Application> findByIdWithDetails(@Param("id") Long id);
}
