package org.jobcubator.jobcubator.company.domain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

//JpaSpecificationExecutor cho phép bạn xây dựng (build) câu query ở tầng Service một cách linh hoạt.
public interface CompanyRepository extends JpaRepository<Company, UUID>, JpaSpecificationExecutor<Company> {
    Optional<Company> findByName(String name);
    Optional<Company> findByWebsite(String website);
    boolean existsByName(String name);
    boolean existsByWebsite(String website);

}
