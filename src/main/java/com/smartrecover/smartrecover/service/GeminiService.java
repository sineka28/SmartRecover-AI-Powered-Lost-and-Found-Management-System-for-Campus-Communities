package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.LostItem;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── Public API ─────────────────────────────────────────────────────────────

    public String analyzeMatch(LostItem lostItem, FoundItem foundItem) {
        if (apiKey != null && !apiKey.isBlank()) {
            try {
                return callGeminiApi(lostItem, foundItem);
            } catch (Exception e) {
                // Fall through to rule-based
            }
        }
        return ruleBasedAnalysis(lostItem, foundItem);
    }

    /**
     * Returns a 0-100 confidence score using keyword-overlap semantic matching.
     * Used by MatchService to populate aiConfidenceScore.
     */
    public double calculateAiConfidence(LostItem lostItem, FoundItem foundItem) {
        return semanticScore(lostItem, foundItem);
    }

    // ── Gemini API ─────────────────────────────────────────────────────────────

    private String callGeminiApi(LostItem lostItem, FoundItem foundItem) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        String prompt = String.format(
            "You are an AI assistant for a campus lost & found system. Analyze if these two items are likely the same item.\n\n" +
            "LOST ITEM:\n  Name: %s\n  Category: %s\n  Color: %s\n  Location: %s\n  Description: %s\n\n" +
            "FOUND ITEM:\n  Name: %s\n  Category: %s\n  Color: %s\n  Location: %s\n  Description: %s\n\n" +
            "Provide a concise analysis:\n" +
            "1. Match Confidence: X%% (be precise)\n" +
            "2. Matching factors: list what matches\n" +
            "3. Differing factors: list what differs\n" +
            "4. Verdict: Highly Likely / Possible / Unlikely\n" +
            "Keep the response under 200 words.",
            safe(lostItem.getItemName()), safe(lostItem.getCategory()),
            safe(lostItem.getColor()), safe(lostItem.getLocation()), safe(lostItem.getDescription()),
            safe(foundItem.getItemName()), safe(foundItem.getCategory()),
            safe(foundItem.getColor()), safe(foundItem.getLocation()), safe(foundItem.getDescription())
        );

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, body, Map.class);
            if (response != null) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    if (parts != null && !parts.isEmpty()) {
                        return "🤖 Gemini AI Analysis\n\n" + parts.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            // Fall through
        }
        return ruleBasedAnalysis(lostItem, foundItem);
    }

    // ── Rule-Based Analysis ────────────────────────────────────────────────────

    private String ruleBasedAnalysis(LostItem lostItem, FoundItem foundItem) {
        StringBuilder sb = new StringBuilder();
        int score = 0;

        sb.append("🤖 AI Match Analysis\n\n");
        sb.append("Factor-by-factor breakdown:\n");

        // Name matching (up to 35 pts)
        int nameScore = nameMatchScore(lostItem.getItemName(), foundItem.getItemName());
        score += nameScore;
        if (nameScore >= 35) sb.append("✅ Item names match exactly (35 pts)\n");
        else if (nameScore >= 20) sb.append("⚡ Item names share key words (20 pts)\n");
        else if (nameScore > 0)  sb.append("⚡ Item names partially overlap (").append(nameScore).append(" pts)\n");
        else                      sb.append("❌ Item names differ\n");

        // Category matching (20 pts)
        if (exactMatch(lostItem.getCategory(), foundItem.getCategory())) {
            score += 20;
            sb.append("✅ Same category (20 pts)\n");
        } else {
            sb.append("❌ Different categories\n");
        }

        // Color matching (20 pts)
        if (lostItem.getColor() == null || foundItem.getColor() == null) {
            sb.append("⚠️  Color info missing\n");
        } else if (exactMatch(lostItem.getColor(), foundItem.getColor())) {
            score += 20;
            sb.append("✅ Same color (20 pts)\n");
        } else {
            sb.append("❌ Different colors\n");
        }

        // Location matching (15 pts)
        if (exactMatch(lostItem.getLocation(), foundItem.getLocation())) {
            score += 15;
            sb.append("✅ Same location (15 pts)\n");
        } else {
            sb.append("❌ Different locations\n");
        }

        // Description keyword overlap (10 pts)
        int descScore = keywordOverlapScore(lostItem.getDescription(), foundItem.getDescription(), 10);
        if (descScore > 0) {
            score += descScore;
            sb.append("✅ Description keywords match (+").append(descScore).append(" pts)\n");
        }

        score = Math.min(score, 100);

        sb.append("\n📊 Match Score: ").append(score).append("%\n");

        if (score >= 80) {
            sb.append("🎯 Verdict: Highly likely to be the same item — recommend verification.");
        } else if (score >= 60) {
            sb.append("🔍 Verdict: Possible match — further verification recommended.");
        } else if (score >= 40) {
            sb.append("⚠️  Verdict: Low confidence match — may or may not be the same item.");
        } else {
            sb.append("❌ Verdict: Items are unlikely to be the same.");
        }

        return sb.toString();
    }

    // ── Scoring Helpers ────────────────────────────────────────────────────────

    /**
     * Full semantic score 0-100 used for matchPercentage.
     */
    public double semanticScore(LostItem lostItem, FoundItem foundItem) {
        int score = 0;

        // Name (up to 35)
        score += nameMatchScore(lostItem.getItemName(), foundItem.getItemName());

        // Category (20)
        if (exactMatch(lostItem.getCategory(), foundItem.getCategory())) score += 20;

        // Color (20)
        if (exactMatch(lostItem.getColor(), foundItem.getColor())) score += 20;

        // Location (15)
        if (exactMatch(lostItem.getLocation(), foundItem.getLocation())) score += 15;

        // Description bonus (10)
        score += keywordOverlapScore(lostItem.getDescription(), foundItem.getDescription(), 10);

        return Math.min(score, 100);
    }

    /**
     * Name matching: exact = 35, keyword overlap = 5–20, substring = 10.
     */
    private int nameMatchScore(String a, String b) {
        if (a == null || b == null) return 0;
        String an = a.trim().toLowerCase();
        String bn = b.trim().toLowerCase();
        if (an.equals(bn)) return 35;
        if (an.contains(bn) || bn.contains(an)) return 20;
        // keyword overlap
        Set<String> aWords = significantWords(an);
        Set<String> bWords = significantWords(bn);
        Set<String> common = new HashSet<>(aWords);
        common.retainAll(bWords);
        if (common.isEmpty()) return 0;
        double overlapRatio = (double) common.size() / Math.min(aWords.size(), bWords.size());
        return (int) Math.round(overlapRatio * 20); // up to 20
    }

    /**
     * Keyword overlap for description / free text, capped at maxPts.
     */
    private int keywordOverlapScore(String a, String b, int maxPts) {
        if (a == null || b == null || a.isBlank() || b.isBlank()) return 0;
        Set<String> aW = significantWords(a.toLowerCase());
        Set<String> bW = significantWords(b.toLowerCase());
        if (aW.isEmpty() || bW.isEmpty()) return 0;
        Set<String> common = new HashSet<>(aW);
        common.retainAll(bW);
        if (common.isEmpty()) return 0;
        double ratio = (double) common.size() / Math.min(aW.size(), bW.size());
        return (int) Math.min(Math.round(ratio * maxPts), maxPts);
    }

    /** Tokenise into meaningful words (filter stop words, short tokens). */
    private Set<String> significantWords(String text) {
        if (text == null) return Collections.emptySet();
        Set<String> stopWords = Set.of(
            "the","a","an","in","on","at","for","with","of","and","or","is","it",
            "my","i","was","to","from","near","this","that","have","has","been"
        );
        return Arrays.stream(text.split("[\\s,;.!?/\\-]+"))
            .filter(w -> w.length() > 2 && !stopWords.contains(w))
            .collect(Collectors.toSet());
    }

    private boolean exactMatch(String a, String b) {
        if (a == null || b == null) return false;
        return a.trim().equalsIgnoreCase(b.trim());
    }

    private String safe(String v) { return v != null ? v : "N/A"; }
}
