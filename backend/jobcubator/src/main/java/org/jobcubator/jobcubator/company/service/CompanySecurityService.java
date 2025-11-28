package org.jobcubator.jobcubator.company.service;

import org.jobcubator.jobcubator.company.domain.CompanyRole;
import org.jobcubator.jobcubator.user.domain.User;

import java.util.UUID;

public interface CompanySecurityService {
    boolean hasPermission(UUID companyId, User user, CompanyRole... allowedRoles);
    boolean canManageApplications(UUID companyId, User user);
    boolean isCompanyMember(UUID companyId, User user);

}
