package com.smartrecover.smartrecover.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * AiAgentService — powers the 8-agent AI system endpoints.
 * Falls back to smart rule-based logic when Gemini API key is absent.
 */
@Service
public class AiAgentService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ── Agent 1: Report Agent / Chat ───────────────────────────────────────────

    public String chat(String userMessage, String context) {
        if (apiKey != null && !apiKey.isBlank()) {
            try { return callGeminiChat(userMessage, context); } catch (Exception ignored) {}
        }
        return ruleBasedChat(userMessage, context);
    }

    private String callGeminiChat(String message, String context) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        String prompt = String.format(
            "You are a helpful campus lost & found assistant. Context: %s\n\nUser: %s\n\n" +
            "Respond naturally and ask one follow-up question to gather more details about the lost item. " +
            "Keep your response under 80 words and friendly.",
            context, message
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
                    if (parts != null && !parts.isEmpty()) return (String) parts.get(0).get("text");
                }
            }
        } catch (Exception ignored) {}
        return ruleBasedChat(message, context);
    }

    private String ruleBasedChat(String message, String context) {
        String lower = message.toLowerCase();
        if (lower.contains("laptop") || lower.contains("computer")) {
            return "I see you lost a laptop! Can you tell me the brand (e.g. Dell, HP, Apple) and the color? Also, any stickers or scratches that would help identify it?";
        } else if (lower.contains("bag") || lower.contains("backpack")) {
            return "Got it — a bag! What brand is it and what color? Were there any items inside that you can describe? Any distinctive marks or damage?";
        } else if (lower.contains("phone") || lower.contains("mobile")) {
            return "A phone — noted! What's the model and color? Do you have a case on it? Any screen damage or unique features?";
        } else if (lower.contains("key") || lower.contains("keys")) {
            return "Keys can be tricky! How many keys are on the ring? Any key fobs, tags, or distinctive keychains attached?";
        } else if (lower.contains("wallet") || lower.contains("purse")) {
            return "A wallet — understood! What color and material is it? Was there cash or any cards inside that you remember?";
        } else if (lower.contains("umbrella")) {
            return "An umbrella! What color is it? Any brand markings or unique handle design?";
        } else {
            return "Thanks for the information! Could you describe any unique marks, colors, or features that would help identify your item? The more specific you are, the better our AI can match it!";
        }
    }

    // ── Agent 3: Description Agent ─────────────────────────────────────────────

    public String enhanceDescription(String simpleDescription, String category, String color) {
        if (apiKey != null && !apiKey.isBlank()) {
            try { return callGeminiEnhance(simpleDescription, category, color); } catch (Exception ignored) {}
        }
        return ruleBasedEnhance(simpleDescription, category, color);
    }

    private String callGeminiEnhance(String desc, String category, String color) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        String prompt = String.format(
            "You are a Description Agent for a campus lost & found system. " +
            "Transform this simple item description into a detailed, search-optimized description " +
            "that includes likely brand, size, material, condition, and any distinctive features.\n\n" +
            "Item Category: %s\nColor: %s\nSimple Description: %s\n\n" +
            "Generate a detailed description in 2-3 sentences. Be specific and practical. " +
            "Do not invent serial numbers or ownership details.",
            safe(category), safe(color), safe(desc)
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
                    if (parts != null && !parts.isEmpty()) return ((String) parts.get(0).get("text")).trim();
                }
            }
        } catch (Exception ignored) {}
        return ruleBasedEnhance(desc, category, color);
    }

    private String ruleBasedEnhance(String desc, String category, String color) {
        if (desc == null || desc.isBlank()) return desc;
        String d = desc.trim();
        String c = color != null ? color : "unspecified color";
        String cat = category != null ? category : "item";

        // Enrich based on category
        String suffix = "";
        if (cat.toLowerCase().contains("bag") || cat.toLowerCase().contains("backpack")) {
            suffix = " Item has standard bag compartments and may contain personal belongings. Check for brand logos on front pockets and straps.";
        } else if (cat.toLowerCase().contains("electronic") || cat.toLowerCase().contains("laptop")) {
            suffix = " Device may have stickers, screen protectors, or scratches as identifying marks. Check manufacturer label on underside.";
        } else if (cat.toLowerCase().contains("keys")) {
            suffix = " Key ring may include key fobs, tags, or multiple keys. Check for any attached accessories.";
        } else if (cat.toLowerCase().contains("documents") || cat.toLowerCase().contains("cards")) {
            suffix = " May contain student ID, bank cards, or other personal identification documents.";
        }

        return String.format("%s %s%s. Color: %s. If found, please check for any personal identification or markings.",
            cat, d, suffix, c);
    }

    // ── Agent 6: Verification Agent ────────────────────────────────────────────

    public List<String> generateVerificationQuestions(String itemDescription, String itemName) {
        if (apiKey != null && !apiKey.isBlank()) {
            try { return callGeminiVerification(itemDescription, itemName); } catch (Exception ignored) {}
        }
        return ruleBasedVerification(itemDescription, itemName);
    }

    private List<String> callGeminiVerification(String desc, String name) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        String prompt = String.format(
            "You are a Verification Agent for a campus lost & found system. " +
            "Generate 4 ownership verification questions for this item that only the true owner would know.\n\n" +
            "Item: %s\nDescription: %s\n\n" +
            "Rules: Do NOT ask about item color or brand (publicly visible). " +
            "Ask about: contents, stickers, damage, purchase date range, registration/serial numbers, unique marks.\n" +
            "Format: Return exactly 4 questions, one per line, numbered 1-4.",
            safe(name), safe(desc)
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
                        String text = (String) parts.get(0).get("text");
                        List<String> questions = new ArrayList<>();
                        for (String line : text.split("\n")) {
                            String trimmed = line.replaceFirst("^\\d+\\.\\s*", "").trim();
                            if (!trimmed.isEmpty()) questions.add(trimmed);
                        }
                        if (!questions.isEmpty()) return questions.subList(0, Math.min(4, questions.size()));
                    }
                }
            }
        } catch (Exception ignored) {}
        return ruleBasedVerification(desc, name);
    }

    private List<String> ruleBasedVerification(String desc, String name) {
        List<String> questions = new ArrayList<>();
        String lower = (name + " " + safe(desc)).toLowerCase();

        if (lower.contains("laptop") || lower.contains("computer")) {
            questions.add("What stickers, if any, are attached to the lid or body of the laptop?");
            questions.add("What is the approximate year you purchased this device?");
            questions.add("Describe any screen damage, scratches, or dents on the device.");
            questions.add("What was the last application or website open before you lost it?");
        } else if (lower.contains("bag") || lower.contains("backpack")) {
            questions.add("What items were inside the bag when you lost it?");
            questions.add("Describe any damage, patches, or pins on the bag.");
            questions.add("What color or pattern is the lining inside the bag?");
            questions.add("Are there any name tags, keychain accessories, or personal items attached?");
        } else if (lower.contains("phone") || lower.contains("mobile")) {
            questions.add("What is the wallpaper or lock screen image on the phone?");
            questions.add("Describe any case design, cracks, or scratches on the screen.");
            questions.add("What apps were recently used before the phone was lost?");
            questions.add("What is the approximate purchase month and year of this device?");
        } else if (lower.contains("keys")) {
            questions.add("How many keys are on the key ring?");
            questions.add("Describe any key fobs, tags, or keychains attached.");
            questions.add("What doors or locks do the keys belong to?");
            questions.add("Is there anything engraved on any of the keys or key ring?");
        } else {
            questions.add("Describe any unique marks, scratches, or damage on the item.");
            questions.add("When and where did you purchase this item approximately?");
            questions.add("Are there any engravings, labels, or personal markings on the item?");
            questions.add("What was contained in or with the item when it was lost?");
        }
        return questions;
    }

    // ── Agent 5: Explain Match ─────────────────────────────────────────────────

    public String explainMatch(String lostDesc, String foundDesc, double matchScore) {
        if (apiKey != null && !apiKey.isBlank()) {
            try { return callGeminiExplain(lostDesc, foundDesc, matchScore); } catch (Exception ignored) {}
        }
        return ruleBasedExplain(matchScore);
    }

    private String callGeminiExplain(String lostDesc, String foundDesc, double score) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;
        String prompt = String.format(
            "You are an Explainable AI for a lost & found system. Given these two item descriptions and a match score, " +
            "explain WHY they match (or don't) in plain English.\n\n" +
            "Lost item: %s\nFound item: %s\nMatch score: %.0f%%\n\n" +
            "Provide a clear 2-3 sentence explanation covering: what features matched, what differs, " +
            "and a recommendation. Keep it under 100 words.",
            safe(lostDesc), safe(foundDesc), score
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
                    if (parts != null && !parts.isEmpty()) return ((String) parts.get(0).get("text")).trim();
                }
            }
        } catch (Exception ignored) {}
        return ruleBasedExplain(score);
    }

    private String ruleBasedExplain(double score) {
        if (score >= 80) return String.format("These items are highly likely to be the same — matching score %.0f%%. The item name, category, color, and location all closely align. Recommendation: Proceed with verification and return the item to the owner.", score);
        if (score >= 60) return String.format("These items show a moderate match at %.0f%%. Several key attributes overlap, but some details differ. Recommendation: Contact both parties to verify ownership before confirming.", score);
        return String.format("These items have a low match score of %.0f%%. While there are some similarities, significant differences in description suggest they may be different items. Recommendation: Treat with caution and request detailed verification.", score);
    }

    // ── Utility ────────────────────────────────────────────────────────────────

    private String safe(String v) { return v != null ? v : "N/A"; }
}
