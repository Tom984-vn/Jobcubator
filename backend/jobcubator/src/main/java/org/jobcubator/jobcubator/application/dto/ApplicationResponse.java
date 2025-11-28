package org.jobcubator.jobcubator.application.dto;

import lombok.Builder;
import org.jobcubator.jobcubator.application.domain.ApplicationStatus;

import java.time.Instant;
import java.util.UUID;

@Builder
public record ApplicationResponse(Long id,
                                  ApplicationStatus status,
                                  Instant appliedAt,
                                  String coverLetter,

                                  UUID jobPostId,
                                  String jobTitle,
                                  String companyName,

                                  UUID candidateId,
                                  String candidateName,
                                  String candidateEmail,
                                  String candidateAvatar,
                                  String candidateCv) {
}
