package org.jobcubator.jobcubator.storage.api;

import lombok.RequiredArgsConstructor;
import org.jobcubator.jobcubator.storage.dto.UpdateUserAvatarResponse;
import org.jobcubator.jobcubator.storage.dto.UpdateUserCVResponse;
import org.jobcubator.jobcubator.storage.service.StorageService;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/upload")
class StorageController {

    private final StorageService storageService;

    @PostMapping("/avatar/upload")
    public ResponseEntity<UpdateUserAvatarResponse> uploadAvatar(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file)
    {
        try{
            String objectKey = storageService.updateUserAvatarFromFile(user, file, "avatars");
            UpdateUserAvatarResponse response = UpdateUserAvatarResponse.builder()
                    .message("Avatar uploaded successfully")
                    .objectKey(objectKey)
                    .avatarUrl(storageService.getPresignedUrl(objectKey))
                    .build();

            return ResponseEntity.ok(response);
        }catch (Exception e) {
            e.printStackTrace(); // TODO: DON'T LET ANY ONE SEE THIS SHIT, SHOULD HANDLE IT MORE PROPERLY. (IDK WHAT IS THE ERROR SO YEAH, THIS IS JUST A PLACEHOLDER)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserAvatarResponse.builder().message("Failed to upload avatar").build());
        }
    }

    @PostMapping("/avatar/upload-url")
    public ResponseEntity<UpdateUserAvatarResponse> uploadAvatarFromUrl(@AuthenticationPrincipal User user, @RequestBody String url)
    {
        try{
            String objectKey = storageService.updateUserAvatarFromUrl(user, url, "avatars");
            UpdateUserAvatarResponse response = UpdateUserAvatarResponse.builder()
                    .message("Avatar uploaded successfully")
                    .objectKey(objectKey)
                    .avatarUrl(storageService.getPresignedUrl(objectKey))
                    .build();

            return ResponseEntity.ok(response);
        }catch (Exception e) {
            e.printStackTrace(); // TODO: DON'T LET ANY ONE SEE THIS SHIT, SHOULD HANDLE IT MORE PROPERLY. (IDK WHAT IS THE ERROR SO YEAH, THIS IS JUST A PLACEHOLDER)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserAvatarResponse.builder().message("Failed to upload avatar").build());
        }
    }

    @PostMapping("/cv/upload")
    public ResponseEntity<UpdateUserCVResponse> uploadCVFromFile(@AuthenticationPrincipal User user, @RequestParam("file") MultipartFile file)
    {
        try{
            String objectKey = storageService.updateUserCVFromFile(user, file, "cv");
            UpdateUserCVResponse response = UpdateUserCVResponse.builder()
                    .message("Uploaded cv successfully")
                    .objectKey(objectKey)
                    .cvUrl(storageService.getPresignedUrl(objectKey))
                    .build();
            return ResponseEntity.ok(response);
        }catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserCVResponse.builder().message("Failed to upload CV").build());
        }
    }

    @PostMapping("/cv/upload-url")
    public ResponseEntity<UpdateUserCVResponse> uploadCVFromUrl(@AuthenticationPrincipal User user, @RequestBody String url){
        try{
            String objectKey = storageService.updateUserCVFromUrl(user, url, "cv");
            UpdateUserCVResponse response = UpdateUserCVResponse.builder()
                    .message("Uploaded cv successfully")
                    .objectKey(objectKey)
                    .cvUrl(storageService.getPresignedUrl(objectKey))
                    .build();
            return ResponseEntity.ok(response);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UpdateUserCVResponse.builder().message("Failed to upload CV").build());
        }
    }
    // TODO: IMPLEMENT CV UPLOAD IN THIS SECTION.
}
