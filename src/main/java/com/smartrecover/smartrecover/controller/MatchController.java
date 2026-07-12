package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.dto.ApiResponse;
import com.smartrecover.smartrecover.entity.Match;
import com.smartrecover.smartrecover.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    @GetMapping
    public ResponseEntity<?> getAllMatches() {
        try {
            List<Match> matches = matchService.getAllMatches();
            return ResponseEntity.ok(matches);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMatchById(@PathVariable Long id) {
        try {
            Match match = matchService.getMatchById(id);
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/find")
    public ResponseEntity<?> findMatches() {
        try {
            int count = matchService.findMatches();
            return ResponseEntity.ok(ApiResponse.success("Found " + count + " new matches", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateMatchStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            Match match = matchService.updateMatchStatus(id, status);
            return ResponseEntity.ok(match);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
