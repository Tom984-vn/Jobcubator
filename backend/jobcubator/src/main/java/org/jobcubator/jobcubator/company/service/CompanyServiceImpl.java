package org.jobcubator.jobcubator.company.service;

import org.jobcubator.jobcubator.company.domain.Company;
import org.jobcubator.jobcubator.company.domain.CompanyRepository;
import org.jobcubator.jobcubator.company.domain.CompanyRole;
import org.jobcubator.jobcubator.company.dto.*;
import org.jobcubator.jobcubator.user.domain.Role;
import org.jobcubator.jobcubator.user.domain.User;
import org.jobcubator.jobcubator.user.domain.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class CompanyServiceImpl implements CompanyService{

    private final CompanyRepository companyRepository;
    private final CompanySecurityServiceImpl companySecurityService;
    private final UserRepository userRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository, CompanySecurityServiceImpl companySecurityService, UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.companySecurityService = companySecurityService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void deleteCompany(User user, UUID id) {
        Company company = companyRepository.findById(id).orElseThrow(() -> new RuntimeException("Company not found"));
        if(companySecurityService.canManageCompany(company.getId(), user)) {
            throw new AccessDeniedException("Access denied");
        }
        companyRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyDTO> getMyCompanies(User currentUser) {
        // Use the custom query we wrote in the Repository
        List<Company> companies = companyRepository.findAllByUserId(currentUser.getId());
        return companies.stream()
                .map(company -> mapToDTO(company, currentUser))
                .toList();
    }

    private CompanyDTO mapToDTO(Company company, User currentUser) {
        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .website(company.getWebsite())
                .size(company.getSize())
                .role(company.getRoleForUser(currentUser.getId()))
                .build();
    }

    @Override
    @Transactional
    public CompanyDTO createCompany(User currentUser, CompanyRequestDTO createDTO) {
        Company company = new Company();
        company.setName(createDTO.name());
        company.setWebsite(createDTO.website());
        company.setSize(createDTO.size());
        company.setDescription(createDTO.description());
        company.addMember(currentUser, CompanyRole.OWNER);
        company = companyRepository.save(company);

        if(currentUser.getRole() == Role.CANDIDATE){
            currentUser.setRole(Role.COMPANY);
            userRepository.save(currentUser);
        }

        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .website(company.getWebsite())
                .size(company.getSize())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyDTO getCompanyById(UUID id) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found"));
        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .website(company.getWebsite())
                .size(company.getSize())
                .build();
    }

    @Override
    @Transactional
    public CompanyDTO updateCompany(User currentUser, UUID id, CompanyRequestDTO updateDTO){
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found"));
        if(companySecurityService.canManageCompany(company.getId(), currentUser)) {
            throw new AccessDeniedException("Access denied");
        }
        company.setName(updateDTO.name());
        company.setWebsite(updateDTO.website());
        company.setSize(updateDTO.size());
        company.setDescription(updateDTO.description());
        company = companyRepository.save(company);
        return CompanyDTO.builder()
                .id(company.getId())
                .name(company.getName())
                .website(company.getWebsite())
                .size(company.getSize())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyDTO> filterCompanies(CompanyFilterDTO filterDTO, Pageable pageable) {
        Specification<Company> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filterDTO != null) {
                if (filterDTO.name() != null && !filterDTO.name().isBlank()) {
                    predicates.add(cb.like(cb.lower(root.get("name")), "%" + filterDTO.name().toLowerCase() + "%"));
                }
                if (filterDTO.website() != null && !filterDTO.website().isBlank()) {
                    predicates.add(cb.like(cb.lower(root.get("website")), "%" + filterDTO.website().toLowerCase() + "%"));
                }
                if (filterDTO.size() != null) {
                    predicates.add(cb.equal(root.get("size"), String.valueOf(filterDTO.size())));
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    
        Page<Company> page = companyRepository.findAll(spec, pageable);
        return page.map(c -> CompanyDTO.builder()
                .id(c.getId())
                .name(c.getName())
                .website(c.getWebsite())
                .size(c.getSize())
                .build());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyVacancyDTO> getCompaniesByMostVacancies(String tagName, Pageable pageable) {
        Page<Object[]> results = companyRepository.findCompaniesWithVacanciesByTag(tagName, pageable);

        return results.map(row -> {
            UUID companyId = (UUID) row[0];
            Set<String> tags = companyRepository.findTagsByCompanyId(companyId);

            return new CompanyVacancyDTO(
                    (String) row[1],
                    (String) row[2],
                    (String) row[3],
                    ((Number) row[4]).longValue(),
                    tags
            );
        });
    }
}
