package com.volley.dto;

import java.util.List;
import java.util.Map;

public class CompleteGameStatsRequest {
    private String gameId;
    private String gameMode;
    private List<PlayerCompleteStats> players;
    private Map<String, Object> teamStats;
    private int score;
    private int opponentScore;

    public static class PlayerCompleteStats {
        private String id;
        private String name;
        private String role;
        private Map<String, Object> stats;

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        
        public Map<String, Object> getStats() { return stats; }
        public void setStats(Map<String, Object> stats) { this.stats = stats; }
    }

    // Getters and Setters
    public String getGameId() { return gameId; }
    public void setGameId(String gameId) { this.gameId = gameId; }
    
    public String getGameMode() { return gameMode; }
    public void setGameMode(String gameMode) { this.gameMode = gameMode; }
    
    public List<PlayerCompleteStats> getPlayers() { return players; }
    public void setPlayers(List<PlayerCompleteStats> players) { this.players = players; }
    
    public Map<String, Object> getTeamStats() { return teamStats; }
    public void setTeamStats(Map<String, Object> teamStats) { this.teamStats = teamStats; }
    
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    
    public int getOpponentScore() { return opponentScore; }
    public void setOpponentScore(int opponentScore) { this.opponentScore = opponentScore; }
}

