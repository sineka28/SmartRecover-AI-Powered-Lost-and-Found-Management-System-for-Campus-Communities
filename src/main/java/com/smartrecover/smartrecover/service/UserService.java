package com.smartrecover.smartrecover.service;

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


    // Register a new user
    public User saveUser(User user) {

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }


    // Get all users
    public List<User> getAllUsers() {

        return userRepository.findAll();
    }


    // Get user by ID
    public User getUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + id)
                );
    }


    // Update user
    public User updateUser(Long id, User updatedUser) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + id)
                );


        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());


        if (updatedUser.getPassword() != null &&
                !updatedUser.getPassword().isEmpty()) {

            existingUser.setPassword(
                    passwordEncoder.encode(updatedUser.getPassword())
            );
        }


        return userRepository.save(existingUser);
    }


    // Delete user
    public void deleteUser(Long id) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found with ID: " + id)
                );


        userRepository.delete(existingUser);
    }



    // Login and generate JWT Token
    public String login(String email, String password) {


        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email or Password")
                );


        if (passwordEncoder.matches(password, user.getPassword())) {


            return jwtUtil.generateToken(user.getEmail());


        } else {


            throw new RuntimeException("Invalid Email or Password");

        }
    }
}