package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.FoundItem;
import com.smartrecover.smartrecover.entity.LostItem;
import com.smartrecover.smartrecover.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    boolean existsByLostItem_IdAndFoundItem_Id(
            Long lostItemId,
            Long foundItemId
    );

}