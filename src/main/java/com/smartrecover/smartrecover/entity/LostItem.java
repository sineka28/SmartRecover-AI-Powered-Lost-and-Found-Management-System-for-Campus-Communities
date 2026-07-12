package com.smartrecover.smartrecover.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lost_items")
public class LostItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(length = 2000)
    private String description;

    private String location;

    private LocalDate lostDate;

    private String status = "OPEN"; // OPEN, MATCHED, RECOVERED

    private String category;

    private String color;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "ai_description", length = 2000)
    private String aiDescription;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User reportedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public LostItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getLostDate() { return lostDate; }
    public void setLostDate(LocalDate lostDate) { this.lostDate = lostDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAiDescription() { return aiDescription; }
    public void setAiDescription(String aiDescription) { this.aiDescription = aiDescription; }

    public User getReportedBy() { return reportedBy; }
    public void setReportedBy(User reportedBy) { this.reportedBy = reportedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
