package org.jobcubator.jobcubator.storage.service;

import jakarta.annotation.PostConstruct;
import org.jobcubator.jobcubator.user.domain.User;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import org.springframework.beans.factory.annotation.Value;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
class StorageServiceImpl implements StorageService {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final WebClient webClient;

    @Value("${app.s3.bucket-name}")
    private String bucketName;

    public StorageServiceImpl(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
        this.webClient = WebClient.builder().build();
    }

    // !!!WARNING!!! I DON'T THINK I SHOULD DO THIS IN PRODUCTION SO, JUST CREATE A BUCKET YOURSELF. HIHI. FOR DEMO CODE ONLY, CREATE THE BUCKET MANUALLY IF IN PRODUCTION CODE.
    @PostConstruct
    public void init() {
        // Creates the bucket on startup if it doesn't already exist
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
        } catch (NoSuchBucketException e) {
            System.out.println("Bucket not found, creating: " + bucketName);
            s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
        }
    }

    @Override
    public String updateUserAvatarFromFile(User user, MultipartFile file, String pathPrefix) throws IOException {

        // Validate file type
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed. Provided: " + contentType);
        }

        // Additional validation for specific image types
        List<String> allowedTypes = Arrays.asList("image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
        if (!allowedTypes.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Unsupported image type. Allowed: JPEG, PNG, GIF, WebP");
        }

        String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String fileExtension = "";

        if(originalFileName.contains(".")){
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        // Validate file extension
        List<String> allowedExtensions = Arrays.asList(".jpg", ".jpeg", ".png", ".gif", ".webp");
        if (!allowedExtensions.contains(fileExtension.toLowerCase())) {
            throw new IllegalArgumentException("Invalid file extension: " + fileExtension);
        }

        String objectKey = String.format("%s/%s-%s%s",
                pathPrefix,
                UUID.randomUUID(),
                originalFileName.replace(fileExtension, ""),
                fileExtension
        );

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(file.getContentType())
                .build();

        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        }
        return objectKey;
    }

    @Override
    public String updateUserAvatarFromUrl(User user, String url, String pathPrefix) {
        byte[] fileByte = webClient.get()
                .uri(url)
                .accept(MediaType.APPLICATION_OCTET_STREAM)
                .retrieve()
                .bodyToMono(byte[].class)
                .block(Duration.ofSeconds(30));

        if (fileByte == null){
            throw new RuntimeException("Failed to download file from URL: " + url);
        }

        String contentType = MediaType.APPLICATION_OCTET_STREAM.toString();
        String originalFileName = "file-from-url";

        try{
            originalFileName = url.subSequence(url.lastIndexOf("/")+1, url.length()).toString();
            if (originalFileName.contains("?")) {
                originalFileName = originalFileName.substring(0, originalFileName.indexOf("?"));
            }
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }

        String fileExtension = "";
        if(originalFileName.contains(".")){
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String objectKey = String.format("%s/%s-%s%s",
                pathPrefix,
                UUID.randomUUID(),
                originalFileName.replace(fileExtension, ""),
                fileExtension
        );

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(contentType)
                .build();
        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileByte));
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }
        return objectKey;
    }

    @Override
    public String getPresignedUrl(String objectKey) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(getObjectRequest)
                .build();

        PresignedGetObjectRequest presignedGetObjectRequest = s3Presigner.presignGetObject(presignRequest);
        return presignedGetObjectRequest.url().toString();
    }

    @Override
    public String updateUserCVFromFile(User user, MultipartFile file, String pathPrefix) throws IOException {
        String originalFileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String fileExtension = "";

        if(originalFileName.contains(".")){
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String objectKey = String.format("%s/%s-%s%s",
                pathPrefix,
                UUID.randomUUID(),
                originalFileName.replace(fileExtension, ""),
                fileExtension
        );

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(file.getContentType())
                .build();

        try (InputStream inputStream = file.getInputStream()) {
            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
        }
        return objectKey;
    }

    @Override
    public String updateUserCVFromUrl(User user, String url, String pathPrefix) {
        byte[] fileByte = webClient.get()
                .uri(url)
                .accept(MediaType.APPLICATION_OCTET_STREAM)
                .retrieve()
                .bodyToMono(byte[].class)
                .block(Duration.ofSeconds(30));

        if (fileByte == null){
            throw new RuntimeException("Failed to download file from URL: " + url);
        }

        String contentType = MediaType.APPLICATION_OCTET_STREAM.toString();
        String originalFileName = "file-from-url";

        try{
            originalFileName = url.subSequence(url.lastIndexOf("/")+1, url.length()).toString();
            if (originalFileName.contains("?")) {
                originalFileName = originalFileName.substring(0, originalFileName.indexOf("?"));
            }
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }

        String fileExtension = "";
        if(originalFileName.contains(".")){
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String objectKey = String.format("%s/%s-%s%s",
                pathPrefix,
                UUID.randomUUID(),
                originalFileName.replace(fileExtension, ""),
                fileExtension
        );

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .contentType(contentType)
                .build();
        try {
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileByte));
        }
        catch (Exception e){
            throw new RuntimeException(e);
        }
        return objectKey;
    }

    @Override
    public void deleteFile(String objectKey)
    {
        if(objectKey == null || objectKey.isBlank())
        {
            throw new IllegalArgumentException("Object key cannot be null or blank");
        }

        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(objectKey)
                .build();

        try {
            s3Client.deleteObject(deleteObjectRequest);
        } catch (S3Exception e) {
            throw new RuntimeException("Failed to delete file: " + objectKey + "; Message: " + e.getMessage(), e);
        }
    }
}
