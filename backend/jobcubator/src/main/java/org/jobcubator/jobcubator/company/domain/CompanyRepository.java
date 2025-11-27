package org.jobcubator.jobcubator.company.domain;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

//JpaSpecificationExecutor cho phép bạn xây dựng (build) câu query ở tầng Service một cách linh hoạt.
public interface CompanyRepository extends JpaRepository<Company, UUID>, JpaSpecificationExecutor<Company> {
    Optional<Company> findByName(String name);
    Optional<Company> findByWebsite(String website);
    boolean existsByName(String name);
    boolean existsByWebsite(String website);

    @Query("SELECT jp.company.id as companyId, " +
            "jp.company.name as companyName, " +
            "jp.company.website as website, " +
            "jp.company.size as size, " +
            "SUM(COALESCE(jp.numberOfVacancies, 0)) as totalVacancies " +
            "FROM JobPost jp " +
            "LEFT JOIN jp.tags t " +
            "WHERE (:tagName IS NULL OR :tagName = '' OR t.name = :tagName) " +
            "GROUP BY jp.company.id, jp.company.name, jp.company.website, jp.company.size " +
            "ORDER BY totalVacancies DESC")
    Page<Object[]> findCompaniesWithVacanciesByTag(@Param("tagName") String tagName, Pageable pageable);

    @Query("SELECT DISTINCT t.name FROM JobPost jp JOIN jp.tags t WHERE jp.company.id = :companyId")
    Set<String> findTagsByCompanyId(@Param("companyId") UUID companyId);

    @Query("SELECT c FROM Company c JOIN c.members m WHERE m.user.id = :userId")
    List<Company> findAllByUserId(@Param("userId") UUID userId);

    @Query("SELECT c FROM Company c JOIN c.members m WHERE m.user.id = :userId AND m.role = 'OWNER'")
    List<Company> findOwnedByUserId(@Param("userId") UUID userId);

}
