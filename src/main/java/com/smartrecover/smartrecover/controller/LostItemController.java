package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.dto.ApiResponse;
import com.smartrecover.smartrecover.entity.LostItem;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.service.LostItemService;
import com.smartrecover.smartrecover.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-items")
public class LostItemController {

    @Autowired
    private LostItemService lostItemService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> addLostItem(@RequestBody LostItem lostItem, Authentication authentication) {
        try {
            String email = authentication.getName();
            LostItem saved = lostItemService.saveLostItem(lostItem, email);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllLostItems() {
        try {
            List<LostItem> items = lostItemService.getAllLostItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /** Returns only the items reported by the currently authenticated user. */
    @GetMapping("/my")
    public ResponseEntity<?> getMyLostItems(Authentication authentication) {
        try {
            User currentUser = userService.getUserByEmail(authentication.getName());
            List<LostItem> items = lostItemService.getLostItemsByUser(currentUser.getId());
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLostItemById(@PathVariable Long id) {
        try {
            LostItem item = lostItemService.getLostItemById(id);
            return ResponseEntity.ok(item);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLostItem(@PathVariable Long id, @RequestBody LostItem lostItem,
                                             Authentication authentication) {
        try {
            String email = authentication.getName();
            LostItem updated = lostItemService.updateLostItem(id, lostItem, email);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLostItem(@PathVariable Long id, Authentication authentication) {
        try {
            lostItemService.deleteLostItem(id, authentication.getName());
            return ResponseEntity.ok(ApiResponse.success("Lost item deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
