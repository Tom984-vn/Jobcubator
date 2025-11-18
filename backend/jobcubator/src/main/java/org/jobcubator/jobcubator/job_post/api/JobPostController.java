package org.jobcubator.jobcubator.job_post.api;

import jakarta.validation.Valid;
import org.jobcubator.jobcubator.job_post.dto.JobPostDTO;
import org.jobcubator.jobcubator.job_post.dto.JobPostFilterDTO;
import org.jobcubator.jobcubator.job_post.dto.JobPostRequestDTO;
import org.jobcubator.jobcubator.job_post.service.JobPostService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST Controller xử lý các yêu cầu liên quan đến Bài đăng tuyển dụng (JobPost).
 */
@RestController
@RequestMapping("/api/jobposts") 
public class JobPostController {

    private final JobPostService jobPostService;

    public JobPostController(JobPostService jobPostService) {
        this.jobPostService = jobPostService;
    }

    
    @PostMapping("/{companyId}")
    public ResponseEntity<JobPostDTO> createJobPost(
            @PathVariable UUID companyId,
            @Valid @RequestBody JobPostRequestDTO create) {

        JobPostDTO createdJobPost = jobPostService.createJobPost(companyId, create);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJobPost);
    }

   
    @GetMapping("/{id}")
    public ResponseEntity<JobPostDTO> getJobPostById(@PathVariable UUID id) {
        JobPostDTO jobPost = jobPostService.getJobPostById(id);
        return ResponseEntity.ok(jobPost);
    }

   
    @PutMapping("/{id}")
    public ResponseEntity<JobPostDTO> updateJobPost(
            @PathVariable UUID id,
            @Valid @RequestBody JobPostRequestDTO update) {
        
        JobPostDTO updatedJobPost = jobPostService.updateJobPost(id, update);
        return ResponseEntity.ok(updatedJobPost);
    }

   
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobPost(@PathVariable UUID id) {
        jobPostService.deleteJobPost(id);
        return ResponseEntity.noContent().build();
    }
    
    
    @PostMapping("/filter")
    public ResponseEntity<Page<JobPostDTO>> filterJobPosts(
            // Dùng POST/RequestBody cho filter vì các tiêu chí lọc có thể phức tạp
            @Valid @RequestBody(required = false) JobPostFilterDTO filterDTO, 
            Pageable pageable) {
        
        Page<JobPostDTO> filteredPage = jobPostService.filterJobPosts(filterDTO, pageable);
        return ResponseEntity.ok(filteredPage);
    }

  
    @GetMapping("/by-company/{companyId}")
    public ResponseEntity<Page<JobPostDTO>> getJobPostsByCompanyId(
            @PathVariable UUID companyId,
            Pageable pageable) {

        Page<JobPostDTO> jobPosts = jobPostService.getJobPostsByCompanyId(companyId, pageable);
        return ResponseEntity.ok(jobPosts);
    }

   
    @GetMapping("/by-company-name")
    public ResponseEntity<Page<JobPostDTO>> getJobPostsByCompanyName(
            @RequestParam("name") String companyName,
            Pageable pageable) {
        
        Page<JobPostDTO> jobPosts = jobPostService.getJobPostsByCompanyName(companyName, pageable);
        return ResponseEntity.ok(jobPosts);
    }

    @GetMapping("/top-job-post-by-vacancies")
    public ResponseEntity<Page<JobPostDTO>> getTopVacanciesJobPosts(Pageable pageable) {
        Page<JobPostDTO> jobPosts = jobPostService.getTopVacanciesJobPosts(pageable);
        return ResponseEntity.ok(jobPosts);
    }

    @GetMapping("/top-job-post-by-creation-time")
    public ResponseEntity<Page<JobPostDTO>> getRecentJobPosts(Pageable pageable) {
        Page<JobPostDTO> jobPosts = jobPostService.getRecentJobPosts(pageable);
        return ResponseEntity.ok(jobPosts);
    }

    @GetMapping("/by-tag-name")
    public ResponseEntity<Page<JobPostDTO>> getJobPostsByTagName( @RequestParam String tagName, Pageable pageable) {
        Page<JobPostDTO> jobPosts = jobPostService.getJobPostsByTagName(pageable, tagName);
        return ResponseEntity.ok(jobPosts);
    }
}