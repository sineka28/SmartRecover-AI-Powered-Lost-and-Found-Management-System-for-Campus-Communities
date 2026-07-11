package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.service.ImageStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


@RestController
@RequestMapping("/images")
public class ImageUploadController {


    @Autowired
    private ImageStorageService imageStorageService;



    @PostMapping("/upload")
    public Map<String, String> uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {


        String imagePath =
                imageStorageService.saveImage(file);


        return Map.of(
                "imageUrl",
                imagePath
        );
    }
}