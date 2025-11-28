package org.jobcubator.jobcubator.company.service;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.company.domain.CompanyMember;
import org.jobcubator.jobcubator.company.domain.CompanyMemberRepository;
import org.jobcubator.jobcubator.company.domain.CompanyRole;
import org.jobcubator.jobcubator.company.service.CompanySecurityService;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanySecurityServiceImpl implements CompanySecurityService {

    private final CompanyMemberRepository companyMemberRepository;

    @Override
    @Transactional(readOnly = true)
    public boolean isCompanyMember(UUID companyId, User user) {
        return companyMemberRepository.existsByCompanyIdAndUserId(companyId, user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasPermission(UUID companyId, User user, CompanyRole... allowedRoles) {
        return companyMemberRepository.findByCompanyIdAndUserId(companyId, user.getId())
                .stream()
                .findFirst()
                .map(member -> Arrays.asList(allowedRoles).contains(member.getRole()))
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public boolean canManageApplications(UUID companyId, User user) {
        return hasPermission(companyId, user, CompanyRole.OWNER, CompanyRole.HR);
    }
}
