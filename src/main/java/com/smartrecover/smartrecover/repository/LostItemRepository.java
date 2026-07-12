package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    List<LostItem> findByReportedByIdOrderByCreatedAtDesc(Long userId);
    List<LostItem> findByStatusOrderByCreatedAtDesc(String status);
    List<LostItem> findAllByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
