package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.dto.ApiResponse;
import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.service.FoundItemService;
import com.smartrecover.smartrecover.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/found-items")
public class FoundItemController {

    @Autowired
    private FoundItemService foundItemService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> addFoundItem(@RequestBody FoundItem foundItem,
                                           Authentication authentication) {
        try {
            String email = authentication.getName();
            FoundItem saved = foundItemService.saveFoundItem(foundItem, email);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllFoundItems() {
        try {
            List<FoundItem> items = foundItemService.getAllFoundItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Returns only the items reported by the currently authenticated user. */
    @GetMapping("/my")
    public ResponseEntity<?> getMyFoundItems(Authentication authentication) {
        try {
            User currentUser = userService.getUserByEmail(authentication.getName());
            List<FoundItem> items = foundItemService.getFoundItemsByUser(currentUser.getId());
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getFoundItemById(@PathVariable Long id) {
        try {
            FoundItem item = foundItemService.getFoundItemById(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFoundItem(@PathVariable Long id,
                                              @RequestBody FoundItem foundItem,
                                              Authentication authentication) {
        try {
            String email = authentication.getName();
            FoundItem updated = foundItemService.updateFoundItem(id, foundItem, email);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFoundItem(@PathVariable Long id, Authentication authentication) {
        try {
            foundItemService.deleteFoundItem(id, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Found item deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
