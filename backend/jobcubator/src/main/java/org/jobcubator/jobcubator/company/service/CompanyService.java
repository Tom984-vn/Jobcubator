package org.jobcubator.jobcubator.company.service;

import java.util.UUID;

import org.jobcubator.jobcubator.company.dto.CompanyRequestDTO;
import org.jobcubator.jobcubator.company.dto.CompanyDTO;
import org.jobcubator.jobcubator.company.dto.CompanyFilterDTO;
import org.jobcubator.jobcubator.company.dto.CompanyVacancyDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface CompanyService {
    /**
     * @param id UUID của công ty cần xóa.
     * @throws ResourceNotFoundException nếu không tìm thấy công ty.
     */
    void deleteCompany(UUID id);

    /**
     * @param requestDTO Dữ liệu để tạo công ty mới.
     * @return CompanyDTO của công ty vừa được tạo.
     * @throws BadRequestException nếu dữ liệu không hợp lệ.
     */
    CompanyDTO createCompany(CompanyRequestDTO createDTO);

    /**
     * @param id UUID của công ty cần lấy.
     * @return CompanyDTO của công ty.
     * @throws ResourceNotFoundException nếu không tìm thấy công ty.
     */
    CompanyDTO getCompanyById(UUID id);

    /**
     * @param id UUID của công ty cần lấy.
     * @param requestDTO Dữ liệu để cập nhật công ty.
     * @return CompanyDTO của công ty vừa được cập nhật.
     * @throws ResourceNotFoundException nếu không tìm thấy công ty.
     */
    CompanyDTO updateCompany(UUID id, CompanyRequestDTO updateDTO);

    /**
     * Lọc và tìm kiếm động các công ty theo nhiều tiêu chí.
     * Kết quả trả về được phân trang.
     *
     * @param filterDTO Đối tượng DTO chứa các tiêu chí lọc (có thể null).
     * @param pageable  Thông tin phân trang (trang nào, bao nhiêu mục).
     * @return Một trang (Page) chứa CompanyDTO đã được lọc.
     */
    Page<CompanyDTO> filterCompanies(CompanyFilterDTO filterDTO, Pageable pageable);

    Page<CompanyVacancyDTO> getCompaniesByMostVacancies(String tagName, Pageable pageable);

}