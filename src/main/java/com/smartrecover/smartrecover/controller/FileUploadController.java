package com.smartrecover.smartrecover.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:3001"
})
public class FileUploadController {

    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") + "/uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("file") MultipartFile file) {

        try {

            if (file == null || file.isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("File is empty");
            }

            File uploadFolder = new File(UPLOAD_DIR);

            if (!uploadFolder.exists()) {
                uploadFolder.mkdirs();
            }

            String fileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            File destination =
                    new File(uploadFolder, fileName);

            file.transferTo(destination);

            return ResponseEntity.ok("/uploads/" + fileName);

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body("Image upload failed");
        }
    }
}