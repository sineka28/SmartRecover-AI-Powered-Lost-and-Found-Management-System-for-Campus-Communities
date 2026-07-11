package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.entity.LostItem;
import com.smartrecover.smartrecover.service.LostItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lost-items")
public class LostItemController {

    @Autowired
    private LostItemService lostItemService;

    // Add a Lost Item
    @PostMapping
    public LostItem addLostItem(@RequestBody LostItem lostItem) {
        return lostItemService.saveLostItem(lostItem);
    }

    // Get All Lost Items
    @GetMapping
    public List<LostItem> getAllLostItems() {
        return lostItemService.getAllLostItems();
    }

    // Get Lost Item by ID
    @GetMapping("/{id}")
    public LostItem getLostItemById(@PathVariable Long id) {
        return lostItemService.getLostItemById(id);
    }// Update Lost Item
    @PutMapping("/{id}")
    public LostItem updateLostItem(@PathVariable Long id,
                                   @RequestBody LostItem lostItem) {
        return lostItemService.updateLostItem(id, lostItem);
    }


    // Delete Lost Item
    @DeleteMapping("/{id}")
    public String deleteLostItem(@PathVariable Long id) {
        lostItemService.deleteLostItem(id);
        return "Lost Item deleted successfully!";
    }
}