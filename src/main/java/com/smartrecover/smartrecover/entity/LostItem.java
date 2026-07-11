package com.smartrecover.smartrecover.entity;

import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "lost_items")
public class LostItem {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String itemName;

    private String description;

    private String location;

    private LocalDate lostDate;

    private String status;

    private String category;


    // New field for image
    private String imageUrl;



    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }



    public String getItemName() {
        return itemName;
    }


    public void setItemName(String itemName) {
        this.itemName = itemName;
    }



    public String getDescription() {
        return description;
    }


    public void setDescription(String description) {
        this.description = description;
    }



    public String getLocation() {
        return location;
    }


    public void setLocation(String location) {
        this.location = location;
    }



    public LocalDate getLostDate() {
        return lostDate;
    }


    public void setLostDate(LocalDate lostDate) {
        this.lostDate = lostDate;
    }



    public String getStatus() {
        return status;
    }


    public void setStatus(String status) {
        this.status = status;
    }



    public String getCategory() {
        return category;
    }


    public void setCategory(String category) {
        this.category = category;
    }



    public String getImageUrl() {
        return imageUrl;
    }


    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

}