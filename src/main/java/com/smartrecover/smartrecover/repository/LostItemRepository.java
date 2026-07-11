package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {

}