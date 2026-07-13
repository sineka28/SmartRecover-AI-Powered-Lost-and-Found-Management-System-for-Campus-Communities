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

    // Forward all non-API, non-asset paths to React index.html (SPA catch-all).
    // The regex [^\\.] excludes segments with a dot so static assets (*.js, *.css …)
    // are served directly by the resource handler instead.
    @GetMapping(value = {
        "/",
        "/{path:[^\\.]*}",
        "/{path:[^\\.]*}/**"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
