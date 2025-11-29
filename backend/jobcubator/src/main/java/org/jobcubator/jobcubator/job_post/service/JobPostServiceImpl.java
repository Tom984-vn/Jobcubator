package org.jobcubator.jobcubator.job_post.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.company.domain.Company;
import org.jobcubator.jobcubator.company.domain.CompanyRepository;
import org.jobcubator.jobcubator.company.service.CompanySecurityService;
import org.jobcubator.jobcubator.job_post.domain.JobPost;
import org.jobcubator.jobcubator.job_post.domain.JobPostRepository;
import org.jobcubator.jobcubator.job_post.dto.JobPostDTO;
import org.jobcubator.jobcubator.job_post.dto.JobPostFilterDTO;
import org.jobcubator.jobcubator.job_post.dto.JobPostRequestDTO;
import org.jobcubator.jobcubator.tag.domain.Tag;
import org.jobcubator.jobcubator.tag.service.TagServiceImpl;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;

@Service
@RequiredArgsConstructor
public class JobPostServiceImpl implements JobPostService {

    private final JobPostRepository jobPostRepository;
    private final CompanyRepository companyRepository;
    private final CompanySecurityService companySecurityService;
    private final TagServiceImpl tagService;

    @Override
    @Transactional
    public JobPostDTO createJobPost(User user, UUID companyId, JobPostRequestDTO createDTO) {
        Company company = companyRepository.findById(companyId)
            .orElseThrow(() -> new RuntimeException("Company not found"));

        if(!companySecurityService.canManageApplicationsAndJobPosts(companyId, user)) {
            throw new AccessDeniedException("Access denied");
        }

        JobPost newJobPost = new JobPost();
        newJobPost.setTitle(createDTO.title());
        newJobPost.setCategory(createDTO.category());
        newJobPost.setLocation(createDTO.location());
        newJobPost.setNumberOfVacancies(createDTO.numberOfVacancies());
        newJobPost.setJobType(createDTO.jobType());
        newJobPost.setApplicationDeadline(createDTO.applicationDeadline());
        newJobPost.setMinSalary(createDTO.minSalary());
        newJobPost.setMaxSalary(createDTO.maxSalary());
        newJobPost.setDescription(createDTO.description());
        newJobPost.setRequirements(createDTO.requirements());
        newJobPost.setBenefits(createDTO.benefits());
        newJobPost.setSchedule(createDTO.schedule());
        newJobPost.setCompany(company);

        if (createDTO.tags() != null && !createDTO.tags().isEmpty()) {
            Set<Tag> tags = tagService.findOrCreateTags(createDTO.tags());
            newJobPost.setTags(tags);
        }

        newJobPost = jobPostRepository.save(newJobPost);
        
        return mapToJobPostDTO(newJobPost, company);
    }

    @Override
    @Transactional(readOnly = true)
    public JobPostDTO getJobPostById(UUID id) {
        JobPost jobPost = jobPostRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("JobPost not found"));
        
        Company company = jobPost.getCompany();
        
        return mapToJobPostDTO(jobPost, company);
    }

    @Override
    @Transactional
    public JobPostDTO updateJobPost(User user, UUID id, JobPostRequestDTO updateDTO) {
        JobPost jobPost = jobPostRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("JobPost not found"));
        Company company = jobPost.getCompany();

        if(!companySecurityService.canManageApplicationsAndJobPosts(company.getId(), user)) {
            throw new AccessDeniedException("Access denied");
        }

        jobPost.setTitle(updateDTO.title());
        jobPost.setLocation(updateDTO.location());
        jobPost.setCategory(updateDTO.category());
        jobPost.setNumberOfVacancies(updateDTO.numberOfVacancies());
        jobPost.setJobType(updateDTO.jobType());
        jobPost.setApplicationDeadline(updateDTO.applicationDeadline());
        jobPost.setMinSalary(updateDTO.minSalary());
        jobPost.setMaxSalary(updateDTO.maxSalary());
        jobPost.setDescription(updateDTO.description());
        jobPost.setRequirements(updateDTO.requirements());
        jobPost.setBenefits(updateDTO.benefits());
        jobPost.setSchedule(updateDTO.schedule());

        jobPost = jobPostRepository.save(jobPost);
        return mapToJobPostDTO(jobPost, company);
    }

    @Override
    @Transactional
    public void deleteJobPost(User user, UUID id) {
        JobPost jobPost = jobPostRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("JobPost not found"));

        if(!companySecurityService.canManageApplicationsAndJobPosts(jobPost.getCompany().getId(), user)) {
            throw new AccessDeniedException("Access denied");
        }

        jobPostRepository.delete(jobPost);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostDTO> filterJobPosts(JobPostFilterDTO filter, Pageable pageable) {
        Specification<JobPost> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (filter != null) {
                if (filter.title() != null && !filter.title().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("title")), 
                                        "%" + filter.title().toLowerCase() + "%"));
                }
                if (filter.location() != null && !filter.location().isEmpty()) {
                    predicates.add(cb.like(cb.lower(root.get("location")), 
                                        "%" + filter.location().toLowerCase() + "%"));
                }
                if (filter.jobType() != null && !filter.jobType().isEmpty()) {
                    predicates.add(cb.equal(root.get("jobType"), filter.jobType()));
                }
                if (filter.companyId() != null) {
                    predicates.add(cb.equal(root.get("company").get("id"), filter.companyId()));
                }
    
                // 5. Lọc theo companyName (LIKE, trên quan hệ)
                if (filter.companyName() != null && !filter.companyName().isEmpty()) {
                    // Phải join (ngầm) vào bảng Company
                    predicates.add(cb.like(cb.lower(root.get("company").get("name")), 
                                        "%" + filter.companyName().toLowerCase() + "%"));
                }
    
                // 6. Lọc theo Mức lương TỐI THIỂU
                // (Tìm job có minSalary >= mức user muốn)
                if (filter.minSalary() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("minSalary"), filter.minSalary()));
                }
    
                // 7. Lọc theo Mức lương TỐI ĐA
                // (Tìm job có maxSalary <= mức user muốn)
                if (filter.maxSalary() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("maxSalary"), filter.maxSalary()));
                }
    
                // 8. Lọc theo Hạn nộp (Deadline) - Từ ngày
                if (filter.deadlineFrom() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("applicationDeadline"), filter.deadlineFrom()));
                }
    
                // 9. Lọc theo Hạn nộp (Deadline) - Đến ngày
                if (filter.deadlineTo() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("applicationDeadline"), filter.deadlineTo()));
                }

                // 10. LỌC THEO TAGS (Mới thêm)
                if (filter.tags() != null && !filter.tags().isEmpty()) {
                    // a. Join bảng JobPost với bảng Tags
                    // "tags" là tên biến Set<Tag> tags trong entity JobPost
                    Join<JobPost, Tag> tagsJoin = root.join("tags", JoinType.INNER);

                    // b. Tạo điều kiện: Tag name nằm trong danh sách user gửi lên
                    // (Dùng IN để tìm job chứa ít nhất 1 trong các tag đó)
                    predicates.add(tagsJoin.get("name").in(filter.tags()));

                    // c. QUAN TRỌNG: Khi join 1-nhiều, kết quả có thể bị trùng lặp JobPost
                    // Ví dụ: 1 Job có 2 tag khớp -> trả về 2 dòng. Cần distinct để gộp lại.
                    assert query != null;
                    query.distinct(true);
                }
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<JobPost>page = jobPostRepository.findAll(spec,pageable);
        return mapToJobPostDTO(page);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostDTO> getJobPostsByCompanyId(UUID companyId, Pageable pageable) {
        // 1. (Nên có) Kiểm tra xem công ty có tồn tại không
        if (!companyRepository.existsById(companyId)) {
        throw new ResourceNotFoundException("Company not found with id: " + companyId);
        }

        Page<JobPost> jobPostPage = jobPostRepository.findByCompany_Id(companyId, pageable);
        return mapToJobPostDTO(jobPostPage);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostDTO> getJobPostsByCompanyName(String companyName, Pageable pageable) {
        Page<JobPost> jobPostPage = jobPostRepository.findByCompany_NameContainingIgnoreCase(companyName,pageable);
        return mapToJobPostDTO(jobPostPage);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostDTO> getTopVacanciesJobPosts(Pageable pageable) {
        Page<JobPost>page = jobPostRepository.findAllByOrderByNumberOfVacanciesDesc(pageable);
        return mapToJobPostDTO(page);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostDTO> getRecentJobPosts(Pageable pageable) {
        Page<JobPost>page = jobPostRepository.findAllByOrderByCreatedAtDesc(pageable);
        return mapToJobPostDTO(page);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobPostDTO> getJobPostsByTagName(Pageable pageable, String tagName) {
        Page<JobPost>page = jobPostRepository.findByTagName(tagName, pageable);
        return mapToJobPostDTO(page);
    }

    private JobPostDTO mapToJobPostDTO(JobPost jobPost, Company company) {
        return JobPostDTO.builder()
                .id(jobPost.getId())
                .companyName(company.getName())
                .title(jobPost.getTitle())
                .category(jobPost.getCategory())
                .location(jobPost.getLocation())
                .numberOfVacancies(jobPost.getNumberOfVacancies())
                .jobType(jobPost.getJobType())
                .applicationDeadline(jobPost.getApplicationDeadline())
                .minSalary(jobPost.getMinSalary())
                .maxSalary(jobPost.getMaxSalary())
                .companyId(company.getId())
                .description(jobPost.getDescription())
                .requirements(jobPost.getRequirements())
                .benefits(jobPost.getBenefits())
                .schedule(jobPost.getSchedule())
                .tags(jobPost.getTags().stream().map(Tag::getName).collect(Collectors.toSet()))
                .build();
    }

    private Page<JobPostDTO> mapToJobPostDTO(Page<JobPost> jobPostPage) {
        return jobPostPage.map(jobPost -> {
            Company company = jobPost.getCompany();
            return mapToJobPostDTO(jobPost, company);
        });
    }
}