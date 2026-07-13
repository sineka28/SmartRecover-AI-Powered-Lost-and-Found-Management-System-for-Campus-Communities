package com.smartrecover.smartrecover.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/api/health")
    @ResponseBody
    public String health() {
        return "{\"status\":\"UP\",\"app\":\"SmartRecover API\"}";
    }

    /**
     * Serve index.html for every React client-side route so that BrowserRouter
     * works on direct URL load / page refresh.
     *
     * IMPORTANT: Only map exact known SPA paths — never use a wildcard like
     * "/{path:[^\\.]*}/**" because that pattern also intercepts static asset
     * requests (e.g. /static/js/main.js) and returns HTML instead of JS/CSS,
     * causing a blank white page in production.
     *
     * Static assets under /static/**, /favicon.ico, /manifest.json etc. are
     * served by Spring Boot's built-in ResourceHttpRequestHandler from
     * src/main/resources/static/ and must NOT be handled here.
     */
    @GetMapping(value = {
        // Root — also handled by WelcomePageHandlerMapping but listed for clarity
        "/",

        // Public routes
        "/login",
        "/register",

        // Authenticated student routes
        "/dashboard",
        "/lost-items",
        "/found-items",
        "/matches",
        "/notifications",
        "/ai-agents",
        "/claims",
        "/profile",
        "/search",

        // Admin routes
        "/admin",
        "/admin/users",
        "/admin/claims",

        // Legacy redirect routes (React Router handles the actual redirect)
        "/lost-item",
        "/found-item"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
