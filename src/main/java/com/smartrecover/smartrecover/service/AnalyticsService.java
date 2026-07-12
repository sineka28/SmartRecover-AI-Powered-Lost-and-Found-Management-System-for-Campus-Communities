package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired private UserRepository userRepository;
    @Autowired private LostItemRepository lostItemRepository;
    @Autowired private FoundItemRepository foundItemRepository;
    @Autowired private MatchRepository matchRepository;
    @Autowired private ClaimRepository claimRepository;

    public Map<String, Object> getAnalytics() {
        Map<String, Object> stats = new HashMap<>();

        long totalUsers = userRepository.count();
        long totalLostItems = lostItemRepository.count();
        long totalFoundItems = foundItemRepository.count();
        long totalMatches = matchRepository.count();
        long totalClaims = claimRepository.count();

        long openLostItems = lostItemRepository.countByStatus("OPEN");
        long recoveredItems = lostItemRepository.countByStatus("RECOVERED");
        long openFoundItems = foundItemRepository.countByStatus("OPEN");
        long claimedItems = foundItemRepository.countByStatus("CLAIMED");
        long pendingClaims = claimRepository.countByStatus("PENDING");
        long approvedClaims = claimRepository.countByStatus("APPROVED");
        long pendingMatches = matchRepository.countByStatus("PENDING");
        long confirmedMatches = matchRepository.countByStatus("CONFIRMED");

        double recoveryRate = totalLostItems > 0
                ? Math.round((double) recoveredItems / totalLostItems * 1000.0) / 10.0
                : 0.0;

        stats.put("totalUsers", totalUsers);
        stats.put("totalLostItems", totalLostItems);
        stats.put("totalFoundItems", totalFoundItems);
        stats.put("totalMatches", totalMatches);
        stats.put("totalClaims", totalClaims);
        stats.put("openLostItems", openLostItems);
        stats.put("recoveredItems", recoveredItems);
        stats.put("openFoundItems", openFoundItems);
        stats.put("claimedFoundItems", claimedItems);
        stats.put("pendingClaims", pendingClaims);
        stats.put("approvedClaims", approvedClaims);
        stats.put("pendingMatches", pendingMatches);
        stats.put("confirmedMatches", confirmedMatches);
        stats.put("recoveryRate", recoveryRate);

        return stats;
    }
}
