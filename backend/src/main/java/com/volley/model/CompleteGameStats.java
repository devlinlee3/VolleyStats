package com.volley.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "complete_game_stats")
public class CompleteGameStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "game_id", nullable = false)
    private String gameId;
    
    @Column(name = "game_mode", nullable = false)
    private String gameMode;
    
    @Column(name = "player_id")
    private String playerId;
    
    @Column(name = "player_name")
    private String playerName;
    
    @Column(name = "player_role")
    private String playerRole;
    
    @Column(name = "stats_data", columnDefinition = "TEXT")
    private String statsData; // JSON string containing all stats
    
    @Column(name = "score")
    private Integer score;
    
    @Column(name = "opponent_score")
    private Integer opponentScore;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public CompleteGameStats() {
        this.createdAt = LocalDateTime.now();
    }
    
    public CompleteGameStats(String gameId, String gameMode, String playerId, String playerName, String playerRole, Map<String, Object> stats, Integer score, Integer opponentScore) {
        this.gameId = gameId;
        this.gameMode = gameMode;
        this.playerId = playerId;
        this.playerName = playerName;
        this.playerRole = playerRole;
        this.statsData = convertStatsToJson(stats);
        this.score = score;
        this.opponentScore = opponentScore;
        this.createdAt = LocalDateTime.now();
    }
    
    // Helper method to convert stats map to JSON string
    private String convertStatsToJson(Map<String, Object> stats) {
        if (stats == null) return "{}";
        try {
            // Simple JSON conversion - in production, use a proper JSON library
            StringBuilder json = new StringBuilder("{");
            boolean first = true;
            for (Map.Entry<String, Object> entry : stats.entrySet()) {
                if (!first) json.append(",");
                json.append("\"").append(entry.getKey()).append("\":").append(entry.getValue());
                first = false;
            }
            json.append("}");
            return json.toString();
        } catch (Exception e) {
            return "{}";
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }
    
    public String getGameMode() { return gameMode; }
    public void setGameMode(String gameMode) { this.gameMode = gameMode; }
    
    public String getPlayerId() { return playerId; }
    public void setPlayerId(String playerId) { this.playerId = playerId; }
    
    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }
    
    public String getPlayerRole() { return playerRole; }
    public void setPlayerRole(String playerRole) { this.playerRole = playerRole; }
    
    public String getStatsData() { return statsData; }
    public void setStatsData(String statsData) { this.statsData = statsData; }
    
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    
    public Integer getOpponentScore() { return opponentScore; }
    public void setOpponentScore(Integer opponentScore) { this.opponentScore = opponentScore; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

