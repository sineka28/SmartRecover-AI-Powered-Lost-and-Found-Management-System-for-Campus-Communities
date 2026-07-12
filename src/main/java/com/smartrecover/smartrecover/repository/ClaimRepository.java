package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findAllByOrderByCreatedAtDesc();

    List<Claim> findByClaimantIdOrderByCreatedAtDesc(Long claimantId);

    boolean existsByClaimantIdAndFoundItemId(Long claimantId, Long foundItemId);

    long countByStatus(String status);
}
