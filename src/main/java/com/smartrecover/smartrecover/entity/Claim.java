package com.smartrecover.smartrecover.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User claimant;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "found_item_id", nullable = false)
    private FoundItem foundItem;

    @Column(name = "verification_details", length = 3000)
    private String verificationDetails;

    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    @Column(name = "admin_remarks", length = 1000)
    private String adminRemarks;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public Claim() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getClaimant() { return claimant; }
    public void setClaimant(User claimant) { this.claimant = claimant; }

    public FoundItem getFoundItem() { return foundItem; }
    public void setFoundItem(FoundItem foundItem) { this.foundItem = foundItem; }

    public String getVerificationDetails() { return verificationDetails; }
    public void setVerificationDetails(String verificationDetails) { this.verificationDetails = verificationDetails; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAdminRemarks() { return adminRemarks; }
    public void setAdminRemarks(String adminRemarks) { this.adminRemarks = adminRemarks; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
