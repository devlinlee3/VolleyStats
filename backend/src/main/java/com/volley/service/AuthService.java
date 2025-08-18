package com.volley.service;

import com.volley.dto.LoginResponse;
import com.volley.dto.RegisterResponse;
import com.volley.model.User;
import com.volley.repository.UserRepository;
import com.volley.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponse authenticate(String email, String password) throws Exception {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new Exception("Invalid email or password"));

        if (!user.isEnabled()) {
            throw new Exception("Account is disabled. Please contact administrator.");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new Exception("Invalid email or password");
        }

        String token = jwtUtil.generateToken(email);
        
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId().toString());
        userMap.put("email", user.getEmail());
        userMap.put("firstName", user.getFirstName());
        userMap.put("lastName", user.getLastName());
        userMap.put("role", user.getRole().toString());

        return new LoginResponse(token, userMap);
    }

    public RegisterResponse register(String email, String password, String confirmPassword, 
                                   String firstName, String lastName) throws Exception {
        
        // Validate input
        if (email == null || email.trim().isEmpty()) {
            throw new Exception("Email is required");
        }
        
        if (password == null || password.trim().isEmpty()) {
            throw new Exception("Password is required");
        }
        
        if (firstName == null || firstName.trim().isEmpty()) {
            throw new Exception("First name is required");
        }
        
        if (lastName == null || lastName.trim().isEmpty()) {
            throw new Exception("Last name is required");
        }
        
        // Validate email format
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new Exception("Invalid email format");
        }
        
        // Validate password strength
        if (password.length() < 8) {
            throw new Exception("Password must be at least 8 characters long");
        }
        
        if (!password.matches(".*[A-Z].*")) {
            throw new Exception("Password must contain at least one uppercase letter");
        }
        
        if (!password.matches(".*[a-z].*")) {
            throw new Exception("Password must contain at least one lowercase letter");
        }
        
        if (!password.matches(".*\\d.*")) {
            throw new Exception("Password must contain at least one number");
        }
        
        // Check if passwords match
        if (!password.equals(confirmPassword)) {
            throw new Exception("Passwords do not match");
        }
        
        // Check if user already exists
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("User with this email already exists");
        }
        
        // Create new user
        String encodedPassword = passwordEncoder.encode(password);
        User newUser = new User(email, encodedPassword, firstName, lastName);
        
        // Set default role (can be modified later by admin)
        newUser.setRole(User.UserRole.USER);
        newUser.setEnabled(true);
        
        User savedUser = userRepository.save(newUser);
        
        // Create response
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", savedUser.getId().toString());
        userMap.put("email", savedUser.getEmail());
        userMap.put("firstName", savedUser.getFirstName());
        userMap.put("lastName", savedUser.getLastName());
        userMap.put("role", savedUser.getRole().toString());
        
        return new RegisterResponse("User registered successfully", userMap);
    }
}
