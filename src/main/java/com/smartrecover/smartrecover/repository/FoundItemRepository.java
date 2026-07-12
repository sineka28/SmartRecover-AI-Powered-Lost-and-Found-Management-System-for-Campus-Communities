package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {

    List<FoundItem> findAllByOrderByCreatedAtDesc();

    List<FoundItem> findByReportedByIdOrderByCreatedAtDesc(Long userId);

    long countByStatus(String status);
}
