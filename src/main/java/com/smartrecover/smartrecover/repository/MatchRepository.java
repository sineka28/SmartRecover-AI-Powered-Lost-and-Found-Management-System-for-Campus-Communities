package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findAllByOrderByMatchPercentageDesc();

    boolean existsByLostItem_IdAndFoundItem_Id(Long lostItemId, Long foundItemId);

    long countByStatus(String status);
}
