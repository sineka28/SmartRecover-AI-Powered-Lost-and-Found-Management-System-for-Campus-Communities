package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.LostItem;
import com.smartrecover.smartrecover.entity.Match;
import com.smartrecover.smartrecover.entity.Notification;
import com.smartrecover.smartrecover.repository.FoundItemRepository;
import com.smartrecover.smartrecover.repository.LostItemRepository;
import com.smartrecover.smartrecover.repository.MatchRepository;
import com.smartrecover.smartrecover.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchService {

    @Autowired private MatchRepository matchRepository;
    @Autowired private LostItemRepository lostItemRepository;
    @Autowired private FoundItemRepository foundItemRepository;
    @Autowired private NotificationRepository notificationRepository;
    @Autowired private GeminiService geminiService;

    public Match saveMatch(Match match) {
        return matchRepository.save(match);
    }

    public List<Match> getAllMatches() {
        return matchRepository.findAllByOrderByMatchPercentageDesc();
    }

    public Match getMatchById(Long id) {
        return matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found: " + id));
    }

    // ── Core matching algorithm ────────────────────────────────────────────────

    /**
     * Delegates to GeminiService for consistent semantic scoring across the app.
     */
    public double calculateMatchPercentage(LostItem lostItem, FoundItem foundItem) {
        return geminiService.semanticScore(lostItem, foundItem);
    }

    /**
     * Scans all open lost/found item pairs, creates Match records for pairs
     * above the confidence threshold, and notifies item owners.
     *
     * @return number of NEW matches created in this run
     */
    public int findMatches() {
        List<LostItem> lostItems = lostItemRepository.findAll();
        List<FoundItem> foundItems = foundItemRepository.findAll();
        int newMatches = 0;

        for (LostItem lostItem : lostItems) {
            // Only match OPEN or MATCHED lost items
            String ls = lostItem.getStatus();
            if (!"OPEN".equals(ls) && !"MATCHED".equals(ls)) continue;

            for (FoundItem foundItem : foundItems) {
                if (!"OPEN".equals(foundItem.getStatus())) continue;

                double percentage = calculateMatchPercentage(lostItem, foundItem);
                if (percentage < 40) continue;

                // Skip if this pair already has a match record
                if (matchRepository.existsByLostItem_IdAndFoundItem_Id(
                        lostItem.getId(), foundItem.getId())) continue;

                // Build and save match
                Match match = new Match();
                match.setLostItem(lostItem);
                match.setFoundItem(foundItem);
                match.setMatchPercentage(percentage);
                match.setStatus("PENDING");
                match.setAiConfidenceScore(geminiService.calculateAiConfidence(lostItem, foundItem));
                match.setMatchReason(geminiService.analyzeMatch(lostItem, foundItem));

                matchRepository.save(match);
                newMatches++;

                // ── Notifications ──────────────────────────────────────────
                // Notify the person who reported the lost item
                if (lostItem.getReportedBy() != null) {
                    notify(
                        lostItem.getReportedBy(),
                        "MATCH",
                        String.format("🎯 Potential match found! Your lost item \"%s\" matches a found item \"%s\" with %.0f%% confidence.",
                            lostItem.getItemName(), foundItem.getItemName(), percentage),
                        "/matches"
                    );
                }

                // Notify the person who reported the found item
                if (foundItem.getReportedBy() != null &&
                    !foundItem.getReportedBy().equals(lostItem.getReportedBy())) {
                    notify(
                        foundItem.getReportedBy(),
                        "MATCH",
                        String.format("🎯 Your found item \"%s\" has a potential match with a lost item \"%s\" (%.0f%% confidence).",
                            foundItem.getItemName(), lostItem.getItemName(), percentage),
                        "/matches"
                    );
                }
            }
        }

        return newMatches;
    }

    public Match updateMatchStatus(Long id, String status) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found: " + id));
        match.setStatus(status);

        // If confirmed, update lost item status to MATCHED
        if ("CONFIRMED".equals(status) && match.getLostItem() != null) {
            LostItem li = match.getLostItem();
            li.setStatus("MATCHED");
            lostItemRepository.save(li);

            // Notify lost-item reporter that match is confirmed
            if (li.getReportedBy() != null) {
                notify(li.getReportedBy(), "MATCH",
                    String.format("✅ Your match for \"%s\" has been confirmed. Please proceed to collect the item.",
                        li.getItemName()),
                    "/matches");
            }
        }

        return matchRepository.save(match);
    }

    // ── Helper ─────────────────────────────────────────────────────────────────

    private void notify(com.smartrecover.smartrecover.entity.User user,
                        String type, String message, String link) {
        try {
            Notification n = new Notification();
            n.setUser(user);
            n.setType(type);
            n.setMessage(message);
            n.setLink(link);
            notificationRepository.save(n);
        } catch (Exception ignored) {
            // Notification failure must never break the main flow
        }
    }
}
