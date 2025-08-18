package com.volley.security;

import com.volley.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String requestTokenHeader = request.getHeader("Authorization");
        logger.info("JWT Filter - Request URI: {}, Authorization header: {}", request.getRequestURI(), requestTokenHeader);

        String username = null;
        String jwtToken = null;

        if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
            jwtToken = requestTokenHeader.substring(7);
            logger.info("JWT Filter - Extracted token: {}", jwtToken.substring(0, Math.min(20, jwtToken.length())) + "...");
            try {
                username = jwtUtil.extractUsername(jwtToken);
                logger.info("JWT Filter - Extracted username: {}", username);
            } catch (Exception e) {
                logger.error("Unable to get JWT Token or JWT Token has expired: {}", e.getMessage());
            }
        } else {
            logger.warn("JWT Filter - No Authorization header or invalid format");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(username);
                logger.info("JWT Filter - Loaded user details for: {}", username);
                
                if (jwtUtil.validateToken(jwtToken, username)) {
                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    usernamePasswordAuthenticationToken
                            .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                    logger.info("JWT Filter - Authentication successful for user: {}", username);
                } else {
                    logger.warn("JWT Filter - Token validation failed for user: {}", username);
                }
            } catch (Exception e) {
                logger.error("Error loading user details: {}", e.getMessage());
            }
        } else {
            logger.info("JWT Filter - Username is null or user already authenticated");
        }
        chain.doFilter(request, response);
    }
}
