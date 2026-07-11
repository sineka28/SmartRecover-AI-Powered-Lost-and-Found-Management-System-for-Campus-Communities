package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.entity.Match;
import com.smartrecover.smartrecover.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    @Autowired
    private MatchService matchService;

    // Save Match
    @PostMapping
    public Match saveMatch(@RequestBody Match match) {
        return matchService.saveMatch(match);
    }

    // Get All Matches
    @GetMapping
    public List<Match> getAllMatches() {
        return matchService.getAllMatches();
    }

    // Get Match by ID
    @GetMapping("/{id}")
    public Match getMatchById(@PathVariable Long id) {
        return matchService.getMatchById(id);
    }

    // Automatically Find Matches
    @PostMapping("/find")
    public String findMatches() {

        matchService.findMatches();

        return "Matching completed successfully!";
    }
    // Update Match Status
    @PutMapping("/{id}/status")
    public Match updateMatchStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return matchService.updateMatchStatus(id, status);
    }
}