package com.smartrecover.smartrecover.repository;

import com.smartrecover.smartrecover.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}