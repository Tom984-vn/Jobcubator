
package org.jobcubator.jobcubator.company.service;

import org.jobcubator.jobcubator.company.domain.Company;
import org.jobcubator.jobcubator.company.domain.CompanyRepository;
import org.jobcubator.jobcubator.company.dto.CompanyDTO;
import org.jobcubator.jobcubator.company.dto.CompanyFilterDTO;
import org.jobcubator.jobcubator.company.dto.CompanyRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;


import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional //Dam bao tinh toan ven cua dlieu (chi luu len db khi chay update thanh cong)
public class CompanyServiceImpl implements CompanyService{

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public void deleteCompany(UUID id) {
        companyRepository.deleteById(id);
    }

    @Override
    public CompanyDTO createCompany(CompanyRequestDTO createDTO) {
        Company company = new Company();
        company.setName(createDTO.name());
        company.setWebsite(createDTO.website());
        company.setSize(String.valueOf(createDTO.size()));
        company = companyRepository.save(company);
        return new CompanyDTO(
            company.getId(),
            company.getName(),
            company.getWebsite(),
            Integer.valueOf(company.getSize())
        );
    }

    @Override
    public CompanyDTO getCompanyById(UUID id) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found"));
        return new CompanyDTO(
            company.getId(),
            company.getName(),
            company.getWebsite(),
            Integer.valueOf(company.getSize())
        );
    }

    @Override
    public CompanyDTO updateCompany(UUID id, CompanyRequestDTO updateDTO) {
        Company company = companyRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Company not found"));
        company.setName(updateDTO.name());
        company.setWebsite(updateDTO.website());
        company.setSize(String.valueOf(updateDTO.size()));
        company = companyRepository.save(company);
        return new CompanyDTO(
            company.getId(),
            company.getName(),
            company.getWebsite(),
            Integer.valueOf(company.getSize())
        );    
    }

    @Override
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
        return page.map(c -> new CompanyDTO(
            c.getId(),
            c.getName(),
            c.getWebsite(),
            Integer.valueOf(c.getSize())
        ));
    }
}