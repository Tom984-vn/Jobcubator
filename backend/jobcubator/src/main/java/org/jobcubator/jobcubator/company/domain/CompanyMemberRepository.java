package org.jobcubator.jobcubator.company.domain;

import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CompanyMemberRepository extends JpaRepository<CompanyMember, Long> {
    Optional<CompanyMember> findByCompanyAndUser(Company company, User user);
    boolean existsByCompanyIdAndUserId(UUID companyId, UUID userId);
    Optional<CompanyMember> findByCompanyIdAndUserId(UUID companyId, UUID userId);
}
