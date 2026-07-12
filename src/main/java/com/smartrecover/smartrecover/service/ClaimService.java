package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.entity.Claim;
import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.Notification;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.repository.ClaimRepository;
import com.smartrecover.smartrecover.repository.FoundItemRepository;
import com.smartrecover.smartrecover.repository.NotificationRepository;
import com.smartrecover.smartrecover.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimService {

    @Autowired private ClaimRepository claimRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private FoundItemRepository foundItemRepository;
    @Autowired private NotificationRepository notificationRepository;

    public Claim submitClaim(Long foundItemId, String verificationDetails, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        FoundItem foundItem = foundItemRepository.findById(foundItemId)
                .orElseThrow(() -> new RuntimeException("Found item not found: " + foundItemId));

        if (claimRepository.existsByClaimantIdAndFoundItemId(user.getId(), foundItemId)) {
            throw new RuntimeException("You have already submitted a claim for this item");
        }

        Claim claim = new Claim();
        claim.setClaimant(user);
        claim.setFoundItem(foundItem);
        claim.setVerificationDetails(verificationDetails);
        claim.setStatus("PENDING");
        Claim saved = claimRepository.save(claim);

        // Notify the person who reported the found item
        if (foundItem.getReportedBy() != null) {
            Notification notif = new Notification();
            notif.setUser(foundItem.getReportedBy());
            notif.setMessage(user.getName() + " has submitted a claim for your found item: " + foundItem.getItemName());
            notif.setType("CLAIM");
            notif.setLink("/claims");
            notificationRepository.save(notif);
        }

        return saved;
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Claim> getUserClaims(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return claimRepository.findByClaimantIdOrderByCreatedAtDesc(user.getId());
    }

    /**
     * Returns claim by ID. Only the claimant or an ADMIN may view it.
     */
    public Claim getClaimById(Long id, String userEmail) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + id));
        User actor = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!"ADMIN".equals(actor.getRole()) && !claim.getClaimant().getId().equals(actor.getId())) {
            throw new RuntimeException("Access denied: you can only view your own claims");
        }
        return claim;
    }

    /**
     * Admin-only: update claim status and notify the claimant.
     */
    public Claim updateClaimStatus(Long id, String status, String adminRemarks) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + id));

        claim.setStatus(status);
        claim.setAdminRemarks(adminRemarks);
        claim.setResolvedAt(LocalDateTime.now());

        if ("APPROVED".equals(status)) {
            FoundItem fi = claim.getFoundItem();
            fi.setStatus("CLAIMED");
            foundItemRepository.save(fi);
        }

        Claim saved = claimRepository.save(claim);

        // Notify the claimant of the decision
        Notification notif = new Notification();
        notif.setUser(claim.getClaimant());
        notif.setMessage("Your claim for \"" + claim.getFoundItem().getItemName()
                + "\" has been " + status.toLowerCase() + "."
                + ("APPROVED".equals(status) ? " Please visit the lost & found office to collect your item." : ""));
        notif.setType("CLAIM");
        notif.setLink("/claims");
        notificationRepository.save(notif);

        return saved;
    }
}
