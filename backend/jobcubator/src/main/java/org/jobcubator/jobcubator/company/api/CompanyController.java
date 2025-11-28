package org.jobcubator.jobcubator.company.api;

import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

import org.jobcubator.jobcubator.company.dto.CompanyDTO;
import org.jobcubator.jobcubator.company.dto.CompanyFilterDTO;
import org.jobcubator.jobcubator.company.dto.CompanyRequestDTO;
import org.jobcubator.jobcubator.company.dto.CompanyVacancyDTO;
import org.jobcubator.jobcubator.company.service.CompanyService;
import org.jobcubator.jobcubator.company.service.CompanyServiceImpl;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
    private final CompanyServiceImpl companyService;

    public CompanyController(CompanyServiceImpl companyService){
        this.companyService = companyService;
    }
    @PostMapping("/create") //@Valid ktra object do dua tren cac luat co trong file CompanyRequestDTO
    public ResponseEntity<CompanyDTO> createCompany(@AuthenticationPrincipal User user,@Valid @RequestBody CompanyRequestDTO request){
        CompanyDTO created = companyService.createCompany(user, request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CompanyDTO> updateCompany(@AuthenticationPrincipal User user, @PathVariable("id") UUID id, @Valid @RequestBody CompanyRequestDTO request){
        CompanyDTO updated = companyService.updateCompany(user, id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCompany(@AuthenticationPrincipal User user, @PathVariable("id") UUID id){
        companyService.deleteCompany(user, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable("id") UUID id){
        CompanyDTO company = companyService.getCompanyById(id);
        return ResponseEntity.ok(company);
    }

    @GetMapping("/my-company")
    public ResponseEntity<List<CompanyDTO>> getAllCompanies(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(companyService.getMyCompanies(user));
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<CompanyDTO>> filterCompanies(@RequestBody(required = false) CompanyFilterDTO filterDTO, Pageable pageable){
        Page<CompanyDTO> filterCompanies= companyService.filterCompanies(filterDTO, pageable);
        return ResponseEntity.ok(filterCompanies);

    }

    @GetMapping("/get-by-most-vacancy")
    public ResponseEntity<Page<CompanyVacancyDTO>> getCompaniesWithMostVacancies(@RequestParam(required = false) String tagName, Pageable pageable){
        Page<CompanyVacancyDTO> companies = companyService.getCompaniesByMostVacancies(tagName, pageable);
        return ResponseEntity.ok(companies);
    }

}
