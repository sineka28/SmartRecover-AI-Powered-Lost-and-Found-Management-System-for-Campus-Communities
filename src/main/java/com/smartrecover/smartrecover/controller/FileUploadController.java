package com.smartrecover.smartrecover.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/";

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "File is empty"));
            }

            File uploadFolder = new File(UPLOAD_DIR);
            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String originalName = file.getOriginalFilename();
            String ext = (originalName != null && originalName.contains("."))
                    ? originalName.substring(originalName.lastIndexOf(".")) : "";
            String fileName = UUID.randomUUID() + ext;
            File destination = new File(uploadFolder, fileName);

            file.transferTo(destination);

            String fileUrl = "/uploads/" + fileName;
            return ResponseEntity.ok(Map.of("url", fileUrl, "fileName", fileName));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Upload failed: " + e.getMessage()));
        }
    }
}
