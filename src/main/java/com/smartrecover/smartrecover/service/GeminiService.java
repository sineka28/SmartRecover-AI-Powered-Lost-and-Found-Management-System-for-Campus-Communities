package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.LostItem;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    public String analyzeMatch(LostItem lostItem, FoundItem foundItem) {

        StringBuilder result = new StringBuilder();

        int score = 0;

        if (lostItem.getItemName() != null &&
                foundItem.getItemName() != null &&
                lostItem.getItemName().equalsIgnoreCase(foundItem.getItemName())) {

            score += 40;
            result.append("✔ Item names matched.\n");
        }

        if (lostItem.getCategory() != null &&
                foundItem.getCategory() != null &&
                lostItem.getCategory().equalsIgnoreCase(foundItem.getCategory())) {

            score += 25;
            result.append("✔ Categories matched.\n");
        }

        if (lostItem.getLocation() != null &&
                foundItem.getLocation() != null &&
                lostItem.getLocation().equalsIgnoreCase(foundItem.getLocation())) {

            score += 20;
            result.append("✔ Locations matched.\n");
        }

        if (lostItem.getDescription() != null &&
                foundItem.getDescription() != null &&
                lostItem.getDescription().equalsIgnoreCase(foundItem.getDescription())) {

            score += 15;
            result.append("✔ Descriptions matched.\n");
        }

        result.append("\nAI Match Percentage : ")
                .append(score)
                .append("%");

        if (score >= 80) {
            result.append("\nConclusion : Highly likely to be the same item.");
        } else if (score >= 60) {
            result.append("\nConclusion : Possible match.");
        } else {
            result.append("\nConclusion : Low confidence match.");
        }

        return result.toString();
    }
}
