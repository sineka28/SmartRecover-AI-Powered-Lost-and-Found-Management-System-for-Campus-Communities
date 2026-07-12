package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.LostItem;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.repository.LostItemRepository;
import com.smartrecover.smartrecover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LostItemService {

    @Autowired private LostItemRepository lostItemRepository;
    @Autowired private UserRepository userRepository;

    public LostItem saveLostItem(LostItem lostItem, String userEmail) {
        if (userEmail != null) {
            userRepository.findByEmail(userEmail)
                    .ifPresent(lostItem::setReportedBy);
        }
        if (lostItem.getStatus() == null) lostItem.setStatus("OPEN");
        return lostItemRepository.save(lostItem);
    }

    public List<LostItem> getAllLostItems() {
        return lostItemRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<LostItem> getLostItemsByUser(Long userId) {
        return lostItemRepository.findByReportedByIdOrderByCreatedAtDesc(userId);
    }

    /** Visible to any authenticated user (items are public for campus browsing). */
    public LostItem getLostItemById(Long id) {
        return lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost item not found: " + id));
    }

    /**
     * Update a lost item. Only the owner or an ADMIN may modify it.
     */
    public LostItem updateLostItem(Long id, LostItem updatedItem, String userEmail) {
        LostItem existing = lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost item not found: " + id));

        requireOwnerOrAdmin(existing.getReportedBy(), userEmail, "edit");

        if (updatedItem.getItemName()    != null) existing.setItemName(updatedItem.getItemName());
        if (updatedItem.getDescription() != null) existing.setDescription(updatedItem.getDescription());
        if (updatedItem.getLocation()    != null) existing.setLocation(updatedItem.getLocation());
        if (updatedItem.getCategory()    != null) existing.setCategory(updatedItem.getCategory());
        if (updatedItem.getColor()       != null) existing.setColor(updatedItem.getColor());
        if (updatedItem.getLostDate()    != null) existing.setLostDate(updatedItem.getLostDate());
        if (updatedItem.getStatus()      != null) existing.setStatus(updatedItem.getStatus());
        if (updatedItem.getImageUrl()    != null) existing.setImageUrl(updatedItem.getImageUrl());

        return lostItemRepository.save(existing);
    }

    /**
     * Delete a lost item. Only the owner or an ADMIN may delete it.
     */
    public void deleteLostItem(Long id, String userEmail) {
        LostItem existing = lostItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lost item not found: " + id));

        requireOwnerOrAdmin(existing.getReportedBy(), userEmail, "delete");
        lostItemRepository.deleteById(id);
    }

    // ── Helper ─────────────────────────────────────────────────────────────────

    private void requireOwnerOrAdmin(User owner, String userEmail, String action) {
        User actor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if ("ADMIN".equals(actor.getRole())) return;                // admins can always act
        if (owner != null && owner.getId().equals(actor.getId())) return; // owner can act
        throw new RuntimeException("Access denied: you can only " + action + " your own items");
    }
}
