package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.service.FoundItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/found-items")
public class FoundItemController {

    @Autowired
    private FoundItemService foundItemService;

    // Add Found Item
    @PostMapping
    public FoundItem addFoundItem(@RequestBody FoundItem foundItem) {
        return foundItemService.saveFoundItem(foundItem);
    }

    // Get All Found Items
    @GetMapping
    public List<FoundItem> getAllFoundItems() {
        return foundItemService.getAllFoundItems();
    }
    // Get Found Item by ID
    @GetMapping("/{id}")
    public FoundItem getFoundItemById(@PathVariable Long id) {
        return foundItemService.getFoundItemById(id);
    }
    // Update Found Item
    @PutMapping("/{id}")
    public FoundItem updateFoundItem(@PathVariable Long id,
                                     @RequestBody FoundItem foundItem) {

        return foundItemService.updateFoundItem(id, foundItem);
    }
    // Delete Found Item
    @DeleteMapping("/{id}")
    public String deleteFoundItem(@PathVariable Long id) {

        foundItemService.deleteFoundItem(id);

        return "Found Item deleted successfully!";
    }
}