package org.jobcubator.jobcubator.intergration.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jobcubator.jobcubator.job_post.dto.JobPostDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiSyncService {

    private final RestTemplate restTemplate;

    @Value("ai.service.url")
    private String aiServiceUrl;

    @Async
    public void syncJobToAI(JobPostDTO jobPost){
        String endpoint = aiServiceUrl + "/api/v1/sync/job/" + jobPost.id();
        try {
            log.info("Starting sync job {} to AI Service...", jobPost.id());
            restTemplate.put(endpoint, jobPost);
        } catch (Exception e) {
            log.error("Failed to sync job {} to ai service. Error: {}", jobPost.id(), e.getMessage());
        }
    }
}
