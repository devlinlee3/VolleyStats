package com.volley;

import com.volley.model.User;
import com.volley.model.Player;
import com.volley.model.TeamStat;
import com.volley.repository.UserRepository;
import com.volley.repository.PlayerRepository;
import com.volley.repository.TeamStatRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@SpringBootApplication
public class VolleyStatsApplication {

    public static void main(String[] args) {
        SpringApplication.run(VolleyStatsApplication.class, args);
    }

    @Bean
    CommandLineRunner init(UserRepository userRepository, 
                          PlayerRepository playerRepository,
                          TeamStatRepository teamStatRepository,
                          PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default admin user
            if (userRepository.findByEmail("admin@volleyball.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@volleyball.com");
                admin.setPasswordHash(passwordEncoder.encode("password123"));
                userRepository.save(admin);
                
                // Create sample players
                Player player1 = new Player();
                player1.setName("Sarah Johnson");
                player1.setJerseyNumber(12);
                player1.setPosition("Outside Hitter");
                player1.setUser(admin);
                playerRepository.save(player1);
                
                Player player2 = new Player();
                player2.setName("Mike Rodriguez");
                player2.setJerseyNumber(8);
                player2.setPosition("Setter");
                player2.setUser(admin);
                playerRepository.save(player2);
                
                Player player3 = new Player();
                player3.setName("Emma Davis");
                player3.setJerseyNumber(3);
                player3.setPosition("Middle Blocker");
                player3.setUser(admin);
                playerRepository.save(player3);
                
                // Create initial team stats for game 1
                TeamStat teamStat = new TeamStat();
                teamStat.setGameId("1");
                teamStat.setTotalPoints(0);
                teamStat.setErrors(0);
                teamStat.setMissedServes(0);
                teamStat.setAces(0);
                teamStat.setTimeouts(0);
                teamStat.setTimestamp(LocalDateTime.now());
                teamStatRepository.save(teamStat);
            }
        };
    }
}
