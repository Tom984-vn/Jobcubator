package org.jobcubator.jobcubator.storage.api;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.storage.dto.UpdateUserAvatarResponse;
import org.jobcubator.jobcubator.storage.dto.UpdateUserCVResponse;
import org.jobcubator.jobcubator.storage.dto.UrlUploadRequest;
import org.jobcubator.jobcubator.storage.service.StorageService;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/upload")
class StorageController {

    private final StorageService storageService;

    @PostMapping("/avatar/upload")
    public ResponseEntity<UpdateUserAvatarResponse> uploadAvatar(
            @AuthenticationPrincipal User user, 
            @RequestParam("file") MultipartFile file) {
        try {
            String objectKey = storageService.updateUserAvatarFromFile(user, file, "avatars");
            UpdateUserAvatarResponse response = UpdateUserAvatarResponse.builder()
                    .message("Avatar uploaded successfully")
                    .objectKey(objectKey)
                    .avatarUrl(storageService.getPresignedUrl(objectKey))
                    .build();

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(UpdateUserAvatarResponse.builder()
                            .message("Invalid file: " + e.getMessage())
                            .build());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserAvatarResponse.builder()
                            .message("Failed to upload avatar: IO error")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserAvatarResponse.builder()
                            .message("Failed to upload avatar")
                            .build());
        }
    }

    @PostMapping("/avatar/upload-url")
    public ResponseEntity<UpdateUserAvatarResponse> uploadAvatarFromUrl(
            @AuthenticationPrincipal User user, 
            @RequestBody UrlUploadRequest request) {
        try {
            String objectKey = storageService.updateUserAvatarFromUrl(user, request.url(), "avatars");
            UpdateUserAvatarResponse response = UpdateUserAvatarResponse.builder()
                    .message("Avatar uploaded successfully")
                    .objectKey(objectKey)
                    .avatarUrl(storageService.getPresignedUrl(objectKey))
                    .build();

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(UpdateUserAvatarResponse.builder()
                            .message("Failed to download from URL: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserAvatarResponse.builder()
                            .message("Failed to upload avatar")
                            .build());
        }
    }

    @PostMapping("/cv/upload")
    public ResponseEntity<UpdateUserCVResponse> uploadCVFromFile(
            @AuthenticationPrincipal User user, 
            @RequestParam("file") MultipartFile file) {
        try {
            // Validate CV file type
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }
            
            String contentType = file.getContentType();
            if (contentType == null || 
                !(contentType.equals("application/pdf") || 
                  contentType.equals("application/msword") || 
                  contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))) {
                throw new IllegalArgumentException("Only PDF and Word documents are allowed");
            }

            String objectKey = storageService.updateUserCVFromFile(user, file, "cv");
            UpdateUserCVResponse response = UpdateUserCVResponse.builder()
                    .message("Uploaded CV successfully")
                    .objectKey(objectKey)
                    .cvUrl(storageService.getPresignedUrl(objectKey))
                    .build();
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(UpdateUserCVResponse.builder()
                            .message("Invalid file: " + e.getMessage())
                            .build());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserCVResponse.builder()
                            .message("Failed to upload CV: IO error")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserCVResponse.builder()
                            .message("Failed to upload CV")
                            .build());
        }
    }

    @PostMapping("/cv/upload-url")
    public ResponseEntity<UpdateUserCVResponse> uploadCVFromUrl(
            @AuthenticationPrincipal User user, 
            @RequestBody UrlUploadRequest request) {
        try {
            String objectKey = storageService.updateUserCVFromUrl(user, request.url(), "cv");
            UpdateUserCVResponse response = UpdateUserCVResponse.builder()
                    .message("Uploaded CV successfully")
                    .objectKey(objectKey)
                    .cvUrl(storageService.getPresignedUrl(objectKey))
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(UpdateUserCVResponse.builder()
                            .message("Failed to download from URL: " + e.getMessage())
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserCVResponse.builder()
                            .message("Failed to upload CV")
                            .build());
        }
    }

    @GetMapping("/avatar")
    public ResponseEntity<String> getUserAvatar(@AuthenticationPrincipal User user) {
        try{
            String avatarUrl = storageService.getUserAvatarUrl(user);
            return ResponseEntity.ok(avatarUrl);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Error when create an avatar url"); 
        }
    }

    @GetMapping("/cv")
    public ResponseEntity<String> getUserCv(@AuthenticationPrincipal User user) {
        try{
            String avatarUrl = storageService.getUserCvUrl(user);
            return ResponseEntity.ok(avatarUrl);
        }
        catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error when create a cv url");
        }
    }

}