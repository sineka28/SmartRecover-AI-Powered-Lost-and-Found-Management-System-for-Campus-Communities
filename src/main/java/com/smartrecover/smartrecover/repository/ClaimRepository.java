package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByClaimantIdOrderByCreatedAtDesc(Long userId);
    List<Claim> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
    boolean existsByClaimantIdAndFoundItemId(Long userId, Long foundItemId);
}
