package com.smartrecover.smartrecover.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double matchPercentage;

    @Column(name = "ai_confidence_score")
    private Double aiConfidenceScore;

    private String status = "PENDING"; // PENDING, CONFIRMED, REJECTED

    @Column(name = "match_reason", length = 3000)
    private String matchReason;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lost_item_id")
    private LostItem lostItem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "found_item_id")
    private FoundItem foundItem;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Match() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getMatchPercentage() { return matchPercentage; }
    public void setMatchPercentage(Double matchPercentage) { this.matchPercentage = matchPercentage; }

    public Double getAiConfidenceScore() { return aiConfidenceScore; }
    public void setAiConfidenceScore(Double aiConfidenceScore) { this.aiConfidenceScore = aiConfidenceScore; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }

    public LostItem getLostItem() { return lostItem; }
    public void setLostItem(LostItem lostItem) { this.lostItem = lostItem; }

    public FoundItem getFoundItem() { return foundItem; }
    public void setFoundItem(FoundItem foundItem) { this.foundItem = foundItem; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
