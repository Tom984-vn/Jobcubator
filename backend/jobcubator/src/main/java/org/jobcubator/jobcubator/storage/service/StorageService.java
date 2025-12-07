package org.jobcubator.jobcubator.storage.service;

import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface StorageService {
    String updateUserAvatarFromFile(User user, MultipartFile file, String pathPrefix)throws IOException;
    String updateUserAvatarFromUrl(User user, String url, String pathPrefix);
    String getPresignedUrl(String objectKey);
    String updateUserCVFromFile(User user, MultipartFile file, String pathPrefix)throws IOException;
    String updateUserCVFromUrl(User user, String url, String pathPrefix);
    String getUserAvatarUrl(User user);
    String getUserCvUrl(User user);
    void deleteFile(String objectKey);
}
