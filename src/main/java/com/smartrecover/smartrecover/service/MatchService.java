package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.LostItem;
import com.smartrecover.smartrecover.entity.Match;
import com.smartrecover.smartrecover.repository.FoundItemRepository;
import com.smartrecover.smartrecover.repository.LostItemRepository;
import com.smartrecover.smartrecover.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchService {

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private LostItemRepository lostItemRepository;

    @Autowired
    private FoundItemRepository foundItemRepository;

    @Autowired
    private GeminiService geminiService;


    // Save Match
    public Match saveMatch(Match match) {
        return matchRepository.save(match);
    }


    // Get All Matches
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }


    // Get Match By ID
    public Match getMatchById(Long id) {

        return matchRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Match not found with ID: " + id));
    }


    // Calculate Match Percentage
    public double calculateMatchPercentage(LostItem lostItem, FoundItem foundItem) {

        double score = 0;


        // Item Name Match (40%)
        String lostName = lostItem.getItemName()
                .trim()
                .toLowerCase();

        String foundName = foundItem.getItemName()
                .trim()
                .toLowerCase();


        if (lostName.equals(foundName)) {
            score += 40;
        }


        // Category Match (20%)
        String lostCategory = lostItem.getCategory()
                .trim()
                .toLowerCase();

        String foundCategory = foundItem.getCategory()
                .trim()
                .toLowerCase();


        if (lostCategory.equals(foundCategory)) {
            score += 20;
        }


        // Location Match (20%)
        String lostLocation = lostItem.getLocation()
                .trim()
                .toLowerCase();

        String foundLocation = foundItem.getLocation()
                .trim()
                .toLowerCase();


        if (lostLocation.equals(foundLocation)) {
            score += 20;
        }


        // Description Match (20%)
        String lostDesc = lostItem.getDescription()
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", "");

        String foundDesc = foundItem.getDescription()
                .trim()
                .toLowerCase()
                .replaceAll("\\s+", "");


        if (lostDesc.contains(foundDesc) ||
                foundDesc.contains(lostDesc)) {

            score += 20;
        }


        return score;
    }



    // Find Matches Automatically
    public void findMatches() {


        List<LostItem> lostItems =
                lostItemRepository.findAll();


        List<FoundItem> foundItems =
                foundItemRepository.findAll();



        for (LostItem lostItem : lostItems) {


            for (FoundItem foundItem : foundItems) {


                double percentage =
                        calculateMatchPercentage(
                                lostItem,
                                foundItem
                        );


                if (percentage >= 60) {


                    boolean exists =
                            matchRepository.existsByLostItem_IdAndFoundItem_Id(
                                    lostItem.getId(),
                                    foundItem.getId()
                            );


                    if (!exists) {


                        Match match = new Match();


                        match.setLostItem(lostItem);

                        match.setFoundItem(foundItem);

                        match.setMatchPercentage(percentage);

                        match.setStatus("PENDING");



                        // Gemini AI Explanation

                        String aiResult =
                                geminiService.analyzeMatch(
                                        lostItem,
                                        foundItem
                                );


                        match.setMatchReason(aiResult);



                        matchRepository.save(match);

                    }

                }

            }

        }

    }



    // Update Match Status
    public Match updateMatchStatus(Long id, String status) {


        Match match =
                matchRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Match not found"));


        match.setStatus(status);


        return matchRepository.save(match);

    }

}