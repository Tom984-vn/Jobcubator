package org.jobcubator.jobcubator.application.service;

import org.jobcubator.jobcubator.application.dto.ApplicationRequest;
import org.jobcubator.jobcubator.application.dto.ApplicationResponse;
import org.jobcubator.jobcubator.application.dto.UpdateApplicationStatusRequest;
import org.jobcubator.jobcubator.company.dto.CompanyDTO;
import org.jobcubator.jobcubator.company.dto.CompanyRequestDTO;
import org.jobcubator.jobcubator.user.domain.User;

import java.util.List;
import java.util.UUID;

public interface ApplicationService {
    void applyForJob(User candidate, ApplicationRequest request);
    List<ApplicationResponse> getMyApplications(User candidate);
    List<ApplicationResponse> getApplicationsForJob(User companyUser, UUID jobPostId);
    ApplicationResponse updateStatus(Long applicationId, UpdateApplicationStatusRequest request, User companyUser);
}
