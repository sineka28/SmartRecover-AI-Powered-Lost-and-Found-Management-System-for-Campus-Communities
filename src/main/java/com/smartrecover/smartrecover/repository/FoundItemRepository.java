package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {
    List<FoundItem> findByReportedByIdOrderByCreatedAtDesc(Long userId);
    List<FoundItem> findByStatusOrderByCreatedAtDesc(String status);
    List<FoundItem> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
