package com.volley.dto;

import java.util.Map;

public class RegisterResponse {
    private String message;
    private Map<String, Object> user;

    // Constructors
    public RegisterResponse() {}

    public RegisterResponse(String message, Map<String, Object> user) {
        this.message = message;
        this.user = user;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }
}
