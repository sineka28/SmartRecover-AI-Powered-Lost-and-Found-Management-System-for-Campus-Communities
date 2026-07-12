package com.smartrecover.smartrecover.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/api/health")
    @ResponseBody
    public String health() {
        return "{\"status\":\"UP\",\"app\":\"SmartRecover API\"}";
    }

    // Forward all non-API paths to React index.html
    @GetMapping(value = {
        "/", "/login", "/register", "/dashboard", "/lost-items",
        "/found-items", "/matches", "/claims", "/notifications",
        "/profile", "/settings", "/admin", "/admin/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
