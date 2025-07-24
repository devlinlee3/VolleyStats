package com.volley.service;

import com.volley.dto.LoginResponse;
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
            .orElseThrow(() -> new Exception("User not found"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new Exception("Invalid password");
        }

        String token = jwtUtil.generateToken(email);
        
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId().toString());
        userMap.put("email", user.getEmail());

        return new LoginResponse(token, userMap);
    }
}
