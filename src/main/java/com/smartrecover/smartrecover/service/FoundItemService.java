package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.repository.FoundItemRepository;
import com.smartrecover.smartrecover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoundItemService {

    @Autowired private FoundItemRepository foundItemRepository;
    @Autowired private UserRepository userRepository;

    public FoundItem saveFoundItem(FoundItem foundItem, String userEmail) {
        if (userEmail != null) {
            userRepository.findByEmail(userEmail)
                    .ifPresent(foundItem::setReportedBy);
        }
        if (foundItem.getStatus() == null) foundItem.setStatus("OPEN");
        return foundItemRepository.save(foundItem);
    }

    public List<FoundItem> getAllFoundItems() {
        return foundItemRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<FoundItem> getFoundItemsByUser(Long userId) {
        return foundItemRepository.findByReportedByIdOrderByCreatedAtDesc(userId);
    }

    /** Visible to any authenticated user (items are public for campus browsing). */
    public FoundItem getFoundItemById(Long id) {
        return foundItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found item not found: " + id));
    }

    /**
     * Update a found item. Only the owner or an ADMIN may modify it.
     */
    public FoundItem updateFoundItem(Long id, FoundItem updatedItem, String userEmail) {
        FoundItem existing = foundItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found item not found: " + id));

        requireOwnerOrAdmin(existing.getReportedBy(), userEmail, "edit");

        if (updatedItem.getItemName()    != null) existing.setItemName(updatedItem.getItemName());
        if (updatedItem.getDescription() != null) existing.setDescription(updatedItem.getDescription());
        if (updatedItem.getLocation()    != null) existing.setLocation(updatedItem.getLocation());
        if (updatedItem.getCategory()    != null) existing.setCategory(updatedItem.getCategory());
        if (updatedItem.getColor()       != null) existing.setColor(updatedItem.getColor());
        if (updatedItem.getFoundDate()   != null) existing.setFoundDate(updatedItem.getFoundDate());
        if (updatedItem.getStatus()      != null) existing.setStatus(updatedItem.getStatus());
        if (updatedItem.getImageUrl()    != null) existing.setImageUrl(updatedItem.getImageUrl());

        return foundItemRepository.save(existing);
    }

    /**
     * Delete a found item. Only the owner or an ADMIN may delete it.
     */
    public void deleteFoundItem(Long id, String userEmail) {
        FoundItem existing = foundItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Found item not found: " + id));

        requireOwnerOrAdmin(existing.getReportedBy(), userEmail, "delete");
        foundItemRepository.deleteById(id);
    }

    // ── Helper ─────────────────────────────────────────────────────────────────

    private void requireOwnerOrAdmin(User owner, String userEmail, String action) {
        User actor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("ADMIN".equals(actor.getRole())) return;
        if (owner != null && owner.getId().equals(actor.getId())) return;
        throw new RuntimeException("Access denied: you can only " + action + " your own items");
    }
}
