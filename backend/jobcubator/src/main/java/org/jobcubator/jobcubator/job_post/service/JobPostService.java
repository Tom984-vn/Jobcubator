package org.jobcubator.jobcubator.job_post.service;

import java.util.UUID;

import org.jobcubator.jobcubator.job_post.dto.JobPostDTO;
import org.jobcubator.jobcubator.job_post.dto.JobPostFilterDTO;
import org.jobcubator.jobcubator.job_post.dto.JobPostRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobPostService {

    /**
     * Tạo một tin tuyển dụng mới cho một công ty cụ thể.
     *
     * @param companyId UUID của công ty đăng tin.
     * @param createDTO Dữ liệu để tạo tin tuyển dụng.
     * @return JobPostDTO của tin vừa được tạo.
     * @throws ResourceNotFoundException nếu companyId không tồn tại.
     */
    JobPostDTO createJobPost(UUID companyId, JobPostRequestDTO createDTO);

    /**
     * Lấy thông tin chi tiết của một tin tuyển dụng bằng ID.
     *
     * @param id UUID của tin tuyển dụng.
     * @return JobPostDTO chi tiết.
     * @throws ResourceNotFoundException nếu không tìm thấy.
     */
    JobPostDTO getJobPostById(UUID id);

    /**
     * Cập nhật thông tin của một tin tuyển dụng.
     *
     * @param id        UUID của tin tuyển dụng cần cập nhật.
     * @param updateDTO Dữ liệu mới để cập nhật.
     * @return JobPostDTO sau khi đã cập nhật.
     * @throws ResourceNotFoundException nếu không tìm thấy.
     */
    JobPostDTO updateJobPost(UUID id, JobPostRequestDTO updateDTO);

    /**
     * Xóa một tin tuyển dụng bằng ID.
     *
     * @param id UUID của tin tuyển dụng cần xóa.
     * @throws ResourceNotFoundException nếu không tìm thấy.
     */
    void deleteJobPost(UUID id);

    /**
     * Lọc và tìm kiếm động các tin tuyển dụng (từ thanh search chính).
     *
     * @param filterDTO Các tiêu chí lọc (location, jobType, minSalary, tags...).
     * @param pageable  Thông tin phân trang.
     * @return Một trang (Page) chứa các JobPostDTO đã được lọc.
     */
    Page<JobPostDTO> filterJobPosts(JobPostFilterDTO filterDTO, Pageable pageable);

    /**
     * Lấy tất cả các tin tuyển dụng của một công ty cụ thể (có phân trang).
     * (Dùng cho trang chi tiết công ty).
     *
     * @param companyId UUID của công ty.
     * @param pageable  Thông tin phân trang.
     * @return Một trang (Page) chứa các JobPostDTO.
     * @throws ResourceNotFoundException nếu companyId không tồn tại.
     */
    Page<JobPostDTO> getJobPostsByCompanyId(UUID companyId, Pageable pageable);
    /**
     * Lấy tất cả các tin tuyển dụng của một công ty cụ thể theo tên (có phân trang).
     * (Dùng cho trang chi tiết công ty hoặc trang kết quả tìm kiếm theo tên công ty).
     *
     * @param companyName Tên công ty (hỗ trợ tìm gần đúng/không phân biệt hoa thường nếu áp dụng).
     * @param pageable    Thông tin phân trang.
     * @return Một trang (Page) chứa các JobPostDTO.
     */
    Page<JobPostDTO> getJobPostsByCompanyName(String companyName, Pageable pageable);

    Page<JobPostDTO> getTopVacanciesJobPosts(Pageable pageable);

    Page<JobPostDTO> getRecentJobPosts(Pageable pageable);

    Page<JobPostDTO> getJobPostsByTagName(Pageable pageable, String tagName);
}
