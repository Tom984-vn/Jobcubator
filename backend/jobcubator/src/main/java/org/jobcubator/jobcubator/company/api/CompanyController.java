package org.jobcubator.jobcubator.company.api;

import jakarta.validation.Valid;

import java.util.UUID;

import org.jobcubator.jobcubator.company.dto.CompanyDTO;
import org.jobcubator.jobcubator.company.dto.CompanyFilterDTO;
import org.jobcubator.jobcubator.company.dto.CompanyRequestDTO;
import org.jobcubator.jobcubator.company.service.CompanyService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
    private final CompanyService companyService;
    public CompanyController(CompanyService companyService){
        this.companyService = companyService;
    }
    @PostMapping("/create") //@Valid ktra object do dua tren cac luat co trong file CompanyRequestDTO
    public ResponseEntity<CompanyDTO> createCompany(@Valid @RequestBody CompanyRequestDTO request){
        CompanyDTO created = companyService.createCompany(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/update/{id}") 
    public ResponseEntity<CompanyDTO> updateCompany(@PathVariable("id") UUID id, @Valid @RequestBody CompanyRequestDTO request){
        CompanyDTO updated = companyService.updateCompany(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable("id") UUID id){
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<CompanyDTO> getCompanyById(@PathVariable("id") UUID id){
        CompanyDTO company = companyService.getCompanyById(id);
        return ResponseEntity.ok(company);
    }

    @PostMapping("/filter")
    public ResponseEntity<Page<CompanyDTO>> filterCompanies(@RequestBody(required = false) CompanyFilterDTO filterDTO, Pageable pageable){
        Page<CompanyDTO> filterCompanies= companyService.filterCompanies(filterDTO, pageable);
        return ResponseEntity.ok(filterCompanies);

    }

}
