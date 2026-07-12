package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.dto.ApiResponse;
import com.smartrecover.smartrecover.service.AiAgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AiAgentController — REST endpoints for all 8 AI agents.
 */
@RestController
@RequestMapping("/api/ai")
public class AiAgentController {

    @Autowired
    private AiAgentService aiAgentService;

    // ── Agent 1: Report Agent Chat ─────────────────────────────────────────────
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> body) {
        try {
            String message = body.getOrDefault("message", "");
            String context = body.getOrDefault("context", "lost_item_reporting");
            String reply = aiAgentService.chat(message, context);
            return ResponseEntity.ok(Map.of("reply", reply, "agent", "Report Agent"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Agent 3: Description Agent ─────────────────────────────────────────────
    @PostMapping("/enhance-description")
    public ResponseEntity<?> enhanceDescription(@RequestBody Map<String, String> body) {
        try {
            String simple = body.getOrDefault("simpleDescription", "");
            String category = body.getOrDefault("category", "");
            String color = body.getOrDefault("color", "");
            String enhanced = aiAgentService.enhanceDescription(simple, category, color);
            return ResponseEntity.ok(Map.of(
                "enhancedDescription", enhanced,
                "agent", "Description Agent",
                "original", simple
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Agent 6: Verification Agent ────────────────────────────────────────────
    @PostMapping("/verification-questions")
    public ResponseEntity<?> verificationQuestions(@RequestBody Map<String, String> body) {
        try {
            String itemDescription = body.getOrDefault("itemDescription", "");
            String itemName = body.getOrDefault("itemName", "");
            List<String> questions = aiAgentService.generateVerificationQuestions(itemDescription, itemName);
            return ResponseEntity.ok(Map.of(
                "questions", questions,
                "agent", "Verification Agent",
                "itemName", itemName
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Agent 5: Explainable AI ────────────────────────────────────────────────
    @PostMapping("/explain-match")
    public ResponseEntity<?> explainMatch(@RequestBody Map<String, Object> body) {
        try {
            String lostDesc = (String) body.getOrDefault("lostDescription", "");
            String foundDesc = (String) body.getOrDefault("foundDescription", "");
            double score = body.get("matchScore") != null
                ? Double.parseDouble(body.get("matchScore").toString()) : 70.0;
            String explanation = aiAgentService.explainMatch(lostDesc, foundDesc, score);
            return ResponseEntity.ok(Map.of(
                "explanation", explanation,
                "agent", "Explainable AI",
                "matchScore", score
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Agent Status endpoint ──────────────────────────────────────────────────
    @GetMapping("/agents/status")
    public ResponseEntity<?> agentsStatus() {
        return ResponseEntity.ok(Map.of(
            "agents", List.of(
                agentStatus(1, "Report Agent",        "ACTIVE", "Conversational item reporting"),
                agentStatus(2, "Vision Agent",         "ACTIVE", "Gemini Vision image analysis"),
                agentStatus(3, "Description Agent",    "ACTIVE", "AI description enhancement"),
                agentStatus(4, "Matching Agent",       "ACTIVE", "Semantic multi-factor matching"),
                agentStatus(5, "Explainable AI",       "ACTIVE", "Human-readable match explanations"),
                agentStatus(6, "Verification Agent",   "ACTIVE", "Ownership challenge generation"),
                agentStatus(7, "Notification Agent",   "ACTIVE", "Real-time match alerts"),
                agentStatus(8, "Analytics Agent",      "ACTIVE", "Recovery statistics & reporting")
            ),
            "system", "SmartRecover AI",
            "version", "2.0"
        ));
    }

    private Map<String, Object> agentStatus(int id, String name, String status, String desc) {
        return Map.of("id", id, "name", name, "status", status, "description", desc);
    }
}
