package com.smartrecover.smartrecover.controller;

import com.smartrecover.smartrecover.dto.LoginRequest;
import com.smartrecover.smartrecover.entity.User;
import com.smartrecover.smartrecover.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/users")
public class UserController {


    @Autowired
    private UserService userService;



    // Register user
    @PostMapping
    public User createUser(@RequestBody User user) {

        return userService.saveUser(user);
    }



    // Get all users
    @GetMapping
    public List<User> getAllUsers() {

        return userService.getAllUsers();
    }



    // Get user by id
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {

        return userService.getUserById(id);
    }



    // Update user
    @PutMapping("/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return userService.updateUser(id, user);
    }



    // Delete user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User deleted successfully with ID: " + id;
    }




    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest) {


        try {

            String token = userService.login(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
            );


            return ResponseEntity.ok(
                    Map.of("token", token)
            );


        } catch (Exception e) {


            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}