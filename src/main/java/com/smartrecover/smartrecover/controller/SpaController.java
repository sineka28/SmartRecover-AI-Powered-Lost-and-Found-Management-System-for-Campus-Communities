package com.smartrecover.smartrecover.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Catch-all controller that forwards any non-API, non-static-asset request to
 * the React SPA's index.html so that client-side routing (react-router) works
 * when the page is refreshed or the URL is opened directly.
 *
 * Patterns covered:
 *   /             → index.html
 *   /login        → index.html
 *   /dashboard    → index.html
 *   /lost-items/new → index.html
 *   … etc.
 *
 * Static assets (*.js, *.css, *.ico …) are served by Spring Boot's default
 * resource handler from src/main/resources/static/ and are NOT intercepted here
 * because their URLs contain a file extension matched by the exclusions below.
 */
@Controller
public class SpaController {

    // Matches paths with NO dot in the last segment (i.e. not a file extension).
    // The regex [^\\.] means "any character except a dot", so *.js / *.css / etc.
    // will never hit this mapping and will be served as static resources instead.
    @GetMapping({
        "/",
        "/{path:[^\\.]*}",
        "/{path:[^\\.]*}/**"
    })
    public String spa() {
        return "forward:/index.html";
    }
}
