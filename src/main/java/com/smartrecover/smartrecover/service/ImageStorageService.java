package com.smartrecover.smartrecover.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

import java.util.UUID;


@Service
public class ImageStorageService {


    private final String uploadDirectory = "uploads/";



    public String saveImage(MultipartFile file) throws IOException {


        // Create folder if not exists
        Path uploadPath = Paths.get(uploadDirectory);


        if (!Files.exists(uploadPath)) {

            Files.createDirectories(uploadPath);
        }



        // Create unique filename

        String fileName =
                UUID.randomUUID()
                        + "_"
                        + file.getOriginalFilename();



        Path filePath =
                uploadPath.resolve(fileName);



        // Save file

        Files.copy(
                file.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );



        return filePath.toString();
    }
}