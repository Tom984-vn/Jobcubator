package org.jobcubator.jobcubator.application.service;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.application.domain.Application;
import org.jobcubator.jobcubator.application.domain.ApplicationRepository;
import org.jobcubator.jobcubator.application.domain.ApplicationStatus;
import org.jobcubator.jobcubator.application.dto.ApplicationRequest;
import org.jobcubator.jobcubator.application.dto.ApplicationResponse;
import org.jobcubator.jobcubator.application.dto.UpdateApplicationStatusRequest;
import org.jobcubator.jobcubator.company.domain.CompanyRole;
import org.jobcubator.jobcubator.company.service.CompanySecurityServiceImpl;
import org.jobcubator.jobcubator.job_post.domain.JobPost;
import org.jobcubator.jobcubator.job_post.domain.JobPostRepository;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.jobcubator.jobcubator.storage.service.StorageService;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final JobPostRepository jobPostRepository;
    private final ApplicationRepository applicationRepository;
    private final CompanySecurityServiceImpl companySecurityService;
    private final StorageService storageService;
    @Override
    @Transactional
    public void applyForJob(User candidate, ApplicationRequest request) {
        JobPost jobPost = jobPostRepository.findById(request.jobPostId())
                .orElseThrow(() -> new ResourceNotFoundException("Job post not found"));

        if (applicationRepository.existsByCandidateIdAndJobPostId(candidate.getId(), jobPost.getId())) {
            throw new IllegalArgumentException("Application already exists");
        }

        Application application = Application.builder()
                .candidate(candidate)
                .jobPost(jobPost)
                .coverLetter(request.coverLetter())
                .status(ApplicationStatus.PENDING)
                .build();
        applicationRepository.save(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(User candidate) {
        return applicationRepository.findByCandidateId(candidate.getId()).stream()
                .map(this::mapToCandidateView)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsForJob(User companyUser, UUID jobPostId) {
        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new  ResourceNotFoundException("Job post not found"));

        validatePermission(jobPost, companyUser);

        return applicationRepository.findByJobPostId(jobPostId).stream()
                .map(this::mapToCompanyView)
                .toList();
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, UpdateApplicationStatusRequest request, User companyUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new  ResourceNotFoundException("Application not found"));

        validatePermission(application.getJobPost(), companyUser);

        application.setStatus(request.status());
        Application saved = applicationRepository.save(application);

        return mapToCompanyView(saved);
    }

    // Helper Methods

    private void validatePermission(JobPost jobPost, User user) {
        boolean isAuthorized = companySecurityService.hasPermission(
                jobPost.getCompany().getId(),
                user,
                CompanyRole.OWNER,
                CompanyRole.HR
        );

        if (!isAuthorized) {
            throw new AccessDeniedException("You are not authorized to manage applications for this job");
        }
    }

    private ApplicationResponse mapToCandidateView(Application app) {
        return ApplicationResponse.builder()
                .id(app.getId())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .jobPostId(app.getJobPost().getId())
                .jobTitle(app.getJobPost().getTitle())
                .companyName(app.getJobPost().getCompany().getName())
                .build();
    }

    private ApplicationResponse mapToCompanyView(Application app){
        return ApplicationResponse.builder()
                .id(app.getId())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .jobPostId(app.getJobPost().getId())
                .jobTitle(app.getJobPost().getTitle())
                .companyName(app.getJobPost().getCompany().getName())
                .candidateId(app.getCandidate().getId())
                .candidateName(app.getCandidate().getFullName())
                .candidateEmail(app.getCandidate().getEmail())
                .candidateAvatar(app.getCandidate().getUserProfile().getAvatarPath())
                .candidateCv(storageService.getUserCvUrl(app.getCandidate()))
                .build();
    }
}
