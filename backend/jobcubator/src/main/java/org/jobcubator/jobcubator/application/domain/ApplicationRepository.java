package org.jobcubator.jobcubator.application.domain;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    boolean existsByCandidateIdAndJobPostId(UUID candidateId, UUID jobPostId);

    List<Application> findByJobPostId(UUID jobPostId);

    List<Application> findByCandidateId(UUID candidateId);
}
