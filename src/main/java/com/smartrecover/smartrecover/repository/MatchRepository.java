package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    boolean existsByLostItem_IdAndFoundItem_Id(Long lostItemId, Long foundItemId);
    List<Match> findAllByOrderByMatchPercentageDesc();
    long countByStatus(String status);
}
