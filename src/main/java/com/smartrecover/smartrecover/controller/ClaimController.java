package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.dto.ApiResponse;
import com.smartrecover.smartrecover.entity.Claim;
import com.smartrecover.smartrecover.service.ClaimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    // ── Any authenticated user ────────────────────────────────────────────────

    @PostMapping
    public ResponseEntity<?> submitClaim(@RequestBody Map<String, Object> body,
                                          Authentication authentication) {
        try {
            Long foundItemId = Long.valueOf(body.get("foundItemId").toString());
            String verificationDetails = (String) body.get("verificationDetails");
            Claim claim = claimService.submitClaim(foundItemId, verificationDetails,
                    authentication.getName());
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyClaims(Authentication authentication) {
        try {
            List<Claim> claims = claimService.getUserClaims(authentication.getName());
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClaimById(@PathVariable Long id, Authentication authentication) {
        try {
            Claim claim = claimService.getClaimById(id, authentication.getName());
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // ── Admin-only ────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllClaims() {
        try {
            List<Claim> claims = claimService.getAllClaims();
            return ResponseEntity.ok(claims);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateClaimStatus(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            String remarks = body.get("adminRemarks");
            Claim claim = claimService.updateClaimStatus(id, status, remarks);
            return ResponseEntity.ok(claim);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
