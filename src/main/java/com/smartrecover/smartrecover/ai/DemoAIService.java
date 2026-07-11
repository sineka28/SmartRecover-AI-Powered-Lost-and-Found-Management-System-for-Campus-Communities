package com.smartrecover.smartrecover.ai;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.LostItem;
import org.springframework.stereotype.Service;

@Service
public class DemoAIService implements AIService {

    @Override
    public int calculateMatchPercentage(LostItem lostItem, FoundItem foundItem) {

        int score = 0;

        // Compare item name
        if (lostItem.getItemName() != null &&
                foundItem.getItemName() != null &&
                lostItem.getItemName().equalsIgnoreCase(foundItem.getItemName())) {
            score += 40;
        }

        // Compare category
        if (lostItem.getCategory() != null &&
                foundItem.getCategory() != null &&
                lostItem.getCategory().equalsIgnoreCase(foundItem.getCategory())) {
            score += 30;
        }

        // Compare location
        if (lostItem.getLocation() != null &&
                foundItem.getLocation() != null &&
                lostItem.getLocation().equalsIgnoreCase(foundItem.getLocation())) {
            score += 20;
        }

        // Compare description (simple keyword check)
        if (lostItem.getDescription() != null &&
                foundItem.getDescription() != null) {

            String lostDesc = lostItem.getDescription().toLowerCase();
            String foundDesc = foundItem.getDescription().toLowerCase();

            if (lostDesc.contains("wallet") && foundDesc.contains("wallet")) {
                score += 10;
            } else if (lostDesc.contains("phone") && foundDesc.contains("phone")) {
                score += 10;
            } else if (lostDesc.contains("bag") && foundDesc.contains("bag")) {
                score += 10;
            }
        }

        return Math.min(score, 100);
    }

    @Override
    public String getMatchReason(LostItem lostItem, FoundItem foundItem) {

        int score = calculateMatchPercentage(lostItem, foundItem);

        if (score >= 90) {
            return "Highly likely to be the same item";
        } else if (score >= 70) {
            return "Possible match";
        } else if (score >= 40) {
            return "Low confidence match";
        } else {
            return "Not a match";
        }
    }
}