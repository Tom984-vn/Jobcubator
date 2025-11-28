package org.jobcubator.jobcubator.application.api;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.application.dto.ApplicationRequest;
import org.jobcubator.jobcubator.application.dto.ApplicationResponse;
import org.jobcubator.jobcubator.application.dto.UpdateApplicationStatusRequest;
import org.jobcubator.jobcubator.application.service.ApplicationService;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Void> applyForJob(
            @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal User user
            ){
        applicationService.applyForJob(user, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my-applicatons")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getMyApplications(user));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationResponse>> getMyApplicationsForJob(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getMyApplications(user));
    }

    // Company Endpoints

    @GetMapping("/job/{jobPostId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationForJob(
            @PathVariable UUID jobPostId,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(user, jobPostId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateApplicationStatusRequest request,
            @AuthenticationPrincipal User user
            ){
        return ResponseEntity.ok(applicationService.updateStatus(id, request, user));
    }

}
