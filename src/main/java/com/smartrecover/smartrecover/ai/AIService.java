package com.smartrecover.smartrecover.ai;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.LostItem;

public interface AIService {

    int calculateMatchPercentage(LostItem lostItem, FoundItem foundItem);

    String getMatchReason(LostItem lostItem, FoundItem foundItem);
}