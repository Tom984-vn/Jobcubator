package org.jobcubator.jobcubator.application.dto;

import org.jobcubator.jobcubator.application.domain.ApplicationStatus;

public record UpdateApplicationStatusRequest(ApplicationStatus status) {
}
