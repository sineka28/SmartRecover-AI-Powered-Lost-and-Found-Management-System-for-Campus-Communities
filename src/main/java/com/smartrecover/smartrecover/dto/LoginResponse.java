package com.smartrecover.smartrecover.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private String role;
    private String regNo;
    private String profileImageUrl;

    public LoginResponse(String token, Long userId, String name, String email, String role, String regNo, String profileImageUrl) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
        this.regNo = regNo;
        this.profileImageUrl = profileImageUrl;
    }

    public String getToken() { return token; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getRegNo() { return regNo; }
    public String getProfileImageUrl() { return profileImageUrl; }
}
