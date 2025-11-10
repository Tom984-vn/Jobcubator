package org.jobcubator.jobcubator.storage.dto;


import lombok.Builder;
import org.springframework.web.multipart.MultipartFile;


@Builder
public record UpdateUserAvatarRequest(MultipartFile file, String pathPrefix) {
}
