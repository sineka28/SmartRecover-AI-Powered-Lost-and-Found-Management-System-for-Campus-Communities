package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.LostItem;
import com.smartrecover.smartrecover.repository.LostItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LostItemService {

    @Autowired
    private LostItemRepository lostItemRepository;

    // Save Lost Item
    public LostItem saveLostItem(LostItem lostItem) {
        return lostItemRepository.save(lostItem);
    }

    // Get All Lost Items
    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findAll();
    }

    // Get Lost Item by ID
    public LostItem getLostItemById(Long id) {
        return lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost Item not found with ID: " + id));
    }

    // Update Lost Item
    public LostItem updateLostItem(Long id, LostItem updatedLostItem) {

        LostItem existingItem = lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost Item not found with ID: " + id));

        existingItem.setItemName(updatedLostItem.getItemName());
        existingItem.setDescription(updatedLostItem.getDescription());
        existingItem.setLocation(updatedLostItem.getLocation());
        existingItem.setLostDate(updatedLostItem.getLostDate());
        existingItem.setStatus(updatedLostItem.getStatus());
        existingItem.setCategory(updatedLostItem.getCategory());

        // NEW: Save image URL too
        existingItem.setImageUrl(updatedLostItem.getImageUrl());

        return lostItemRepository.save(existingItem);
    }

    // Delete Lost Item
    public void deleteLostItem(Long id) {

        LostItem lostItem = lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost Item not found with ID: " + id));

        lostItemRepository.delete(lostItem);
    }
}