package com.smartrecover.smartrecover.service;

import com.smartrecover.smartrecover.dto.LoginResponse;
import com.smartrecover.smartrecover.dto.RegisterRequest;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.repository.UserRepository;
import com.smartrecover.smartrecover.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRegNo(request.getRegNo());
        user.setPhone(request.getPhone());
        // Role is always forced to STUDENT on self-registration; promote via DB/admin only
        user.setRole("STUDENT");

        return userRepository.save(user);
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getRegNo(),
                user.getProfileImageUrl()
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User updatedUser) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));

        if (updatedUser.getName() != null) existing.setName(updatedUser.getName());
        if (updatedUser.getPhone() != null) existing.setPhone(updatedUser.getPhone());
        if (updatedUser.getRegNo() != null) existing.setRegNo(updatedUser.getRegNo());
        if (updatedUser.getProfileImageUrl() != null) existing.setProfileImageUrl(updatedUser.getProfileImageUrl());
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        return userRepository.save(existing);
    }

    public void deleteUser(Long id) {
        userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        userRepository.deleteById(id);
    }
}
