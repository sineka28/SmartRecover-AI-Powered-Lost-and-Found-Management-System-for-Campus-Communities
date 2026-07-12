package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    List<LostItem> findAllByOrderByCreatedAtDesc();

    List<LostItem> findByReportedByIdOrderByCreatedAtDesc(Long userId);

    long countByStatus(String status);
}
