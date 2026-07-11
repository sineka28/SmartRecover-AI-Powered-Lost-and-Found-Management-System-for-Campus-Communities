package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.repository.FoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoundItemService {

    @Autowired
    private FoundItemRepository foundItemRepository;

    // Save Found Item
    public FoundItem saveFoundItem(FoundItem foundItem) {

        if (foundItem.getStatus() == null || foundItem.getStatus().isBlank()) {
            foundItem.setStatus("AVAILABLE");
        }

        return foundItemRepository.save(foundItem);
    }

    // Get All Found Items
    public List<FoundItem> getAllFoundItems() {
        return foundItemRepository.findAll();
    }

    // Get Found Item by ID
    public FoundItem getFoundItemById(Long id) {
        return foundItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Found Item not found with ID: " + id));
    }

    // Update Found Item
    public FoundItem updateFoundItem(Long id, FoundItem updatedFoundItem) {

        FoundItem existingItem = foundItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Found Item not found with ID: " + id));

        existingItem.setItemName(updatedFoundItem.getItemName());
        existingItem.setDescription(updatedFoundItem.getDescription());
        existingItem.setCategory(updatedFoundItem.getCategory());
        existingItem.setLocation(updatedFoundItem.getLocation());
        existingItem.setFoundDate(updatedFoundItem.getFoundDate());
        existingItem.setStatus(updatedFoundItem.getStatus());

        // Save Image URL
        existingItem.setImageUrl(updatedFoundItem.getImageUrl());

        return foundItemRepository.save(existingItem);
    }

    // Delete Found Item
    public void deleteFoundItem(Long id) {

        FoundItem foundItem = foundItemRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Found Item not found with ID: " + id));

        foundItemRepository.delete(foundItem);
    }
}