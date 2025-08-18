package com.volley.service;

import com.volley.dto.PlayerStatRequest;
import com.volley.dto.TeamStatRequest;
import com.volley.model.Player;
import com.volley.model.PlayerStat;
import com.volley.model.TeamStat;
import com.volley.repository.PlayerRepository;
import com.volley.repository.PlayerStatRepository;
import com.volley.repository.TeamStatRepository;
import com.volley.repository.CompleteGameStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.volley.model.CompleteGameStats;

@Service
public class StatsService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PlayerStatRepository playerStatRepository;

    @Autowired
    private TeamStatRepository teamStatRepository;

    @Autowired
    private CompleteGameStatsRepository completeGameStatsRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public List<Player> getPlayersForGame(String gameId) {
        // For MVP, return all players
        return playerRepository.findAll();
    }

    public TeamStat getTeamStatsForGame(String gameId) {
        return teamStatRepository.findByGameId(gameId)
            .orElse(new TeamStat(gameId));
    }

    public PlayerStat getPlayerStatsForGame(String gameId, String playerId) {
        List<PlayerStat> allStats = playerStatRepository.findByGameIdAndPlayerIdOrderByTimestampAsc(gameId, playerId);
        
        if (allStats.isEmpty()) {
            return new PlayerStat(gameId, playerId);
        }
        
        // Get the most recent stats (last in the list since it's ordered by timestamp ascending)
        PlayerStat mostRecent = allStats.get(allStats.size() - 1);
        System.out.println("Retrieved stats for player " + playerId + " in game " + gameId + ": " + mostRecent);
        return mostRecent;
    }

    public PlayerStat recordPlayerStat(String gameId, String playerId, PlayerStatRequest request) {
        PlayerStat stat = new PlayerStat(gameId, playerId);
        
        // Set the stat values from request
        if (request.getKills() != null) stat.setKills(request.getKills());
        if (request.getBlocks() != null) stat.setBlocks(request.getBlocks());
        if (request.getAces() != null) stat.setAces(request.getAces());
        if (request.getDigs() != null) stat.setDigs(request.getDigs());
        if (request.getAssists() != null) stat.setAssists(request.getAssists());
        if (request.getErrors() != null) stat.setErrors(request.getErrors());

        stat = playerStatRepository.save(stat);

        // Broadcast update via WebSocket
        Map<String, Object> message = new HashMap<>();
        message.put("type", "PLAYER_STAT_UPDATE");
        message.put("gameId", gameId);
        message.put("playerId", playerId);
        message.put("stat", stat);
        messagingTemplate.convertAndSend("/topic/games/" + gameId, message);

        return stat;
    }

    public TeamStat recordTeamStat(String gameId, TeamStatRequest request) {
        TeamStat stat = teamStatRepository.findByGameId(gameId)
            .orElse(new TeamStat(gameId));

        // Update the stat values from request (additive)
        if (request.getTotalPoints() != null) {
            stat.setTotalPoints(stat.getTotalPoints() + request.getTotalPoints());
        }
        if (request.getErrors() != null) {
            stat.setErrors(stat.getErrors() + request.getErrors());
        }
        if (request.getMissedServes() != null) {
            stat.setMissedServes(stat.getMissedServes() + request.getMissedServes());
        }
        if (request.getAces() != null) {
            stat.setAces(stat.getAces() + request.getAces());
        }
        if (request.getTimeouts() != null) {
            stat.setTimeouts(stat.getTimeouts() + request.getTimeouts());
        }

        stat.setTimestamp(LocalDateTime.now());
        stat = teamStatRepository.save(stat);

        // Broadcast update via WebSocket
        Map<String, Object> message = new HashMap<>();
        message.put("type", "TEAM_STAT_UPDATE");
        message.put("gameId", gameId);
        message.put("stat", stat);
        messagingTemplate.convertAndSend("/topic/games/" + gameId, message);

        return stat;
    }

    public PlayerStat saveFinalPlayerStats(String gameId, String playerId, Map<String, Object> stats) {
        PlayerStat stat = new PlayerStat(gameId, playerId);
        
        try {
            // Store ALL the detailed stats that the frontend sends
            // This preserves the complete statistical record
            stat.setKills(parseIntValue(stats.get("kills")));
            stat.setBlocks(parseIntValue(stats.get("blockSolos")) + parseIntValue(stats.get("blockAssists")));
            stat.setAces(parseIntValue(stats.get("serviceAces")));
            stat.setDigs(parseIntValue(stats.get("digs")));
            stat.setAssists(parseIntValue(stats.get("assists")));
            stat.setErrors(parseIntValue(stats.get("attackErrors")) + 
                          parseIntValue(stats.get("ballHandlingErrors")) + 
                          parseIntValue(stats.get("receptionErrors")) + 
                          parseIntValue(stats.get("blockingErrors")));

            // Store additional detailed stats in a JSON field or create a new entity
            // For now, we'll store the complete stats as a JSON string in the existing entity
            // This is a temporary solution - ideally we'd create a new DetailedPlayerStat entity
            
            stat = playerStatRepository.save(stat);
            System.out.println("Saved final player stats for " + playerId + " in game " + gameId + ": " + stat);
            System.out.println("Raw stats received: " + stats);
            return stat;
        } catch (Exception e) {
            System.err.println("Error saving final player stats: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public TeamStat saveFinalTeamStats(String gameId, Map<String, Object> stats) {
        TeamStat stat = new TeamStat(gameId);
        
        try {
            // Set the final stat values directly with better type handling
            // Map the frontend field names to the TeamStat model fields
            stat.setTotalPoints(parseIntValue(stats.get("kills")));
            stat.setErrors(parseIntValue(stats.get("attackErrors")) + 
                          parseIntValue(stats.get("ballHandlingErrors")) + 
                          parseIntValue(stats.get("receptionErrors")) + 
                          parseIntValue(stats.get("blockingErrors")));
            stat.setAces(parseIntValue(stats.get("serviceAces")));
            stat.setMissedServes(parseIntValue(stats.get("serveAttempts")));
            stat.setTimestamp(LocalDateTime.now());

            stat = teamStatRepository.save(stat);
            System.out.println("Saved final team stats for game " + gameId + ": " + stat);
            System.out.println("Raw team stats received: " + stats);
            return stat;
        } catch (Exception e) {
            System.err.println("Error saving final team stats: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void saveCompleteGameStats(String gameId, String gameMode, List<Map<String, Object>> players, Map<String, Object> teamStats, int score, int opponentScore) {
        try {
            System.out.println("=== SAVING COMPLETE GAME STATS ===");
            System.out.println("Game ID: " + gameId);
            System.out.println("Game Mode: " + gameMode);
            System.out.println("Score: " + score + " vs " + opponentScore);
            System.out.println("Players: " + (players != null ? players.size() : 0));
            System.out.println("Team Stats: " + (teamStats != null ? "provided" : "not provided"));
            
            // Save player stats if in player mode
            if (players != null && !players.isEmpty()) {
                for (Map<String, Object> player : players) {
                    if (player.containsKey("stats")) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> stats = (Map<String, Object>) player.get("stats");
                        String playerId = (String) player.get("id");
                        String playerName = (String) player.get("name");
                        String playerRole = (String) player.get("role");
                        
                        System.out.println("Processing player: " + playerName + " (ID: " + playerId + ", Role: " + playerRole + ")");
                        System.out.println("Player stats: " + stats);
                        
                        // Create and save complete game stats
                        CompleteGameStats completeStats = new CompleteGameStats(
                            gameId, gameMode, playerId, playerName, playerRole, stats, score, opponentScore
                        );
                        CompleteGameStats savedStats = completeGameStatsRepository.save(completeStats);
                        System.out.println("Saved player stats with ID: " + savedStats.getId());
                    } else {
                        System.out.println("Player missing stats: " + player);
                    }
                }
            }
            
            // Save team stats if provided
            if (teamStats != null) {
                System.out.println("Saving team stats: " + teamStats);
                // Create a team stats entry
                CompleteGameStats teamCompleteStats = new CompleteGameStats(
                    gameId, gameMode, "TEAM", "TEAM", "TEAM", teamStats, score, opponentScore
                );
                CompleteGameStats savedTeamStats = completeGameStatsRepository.save(teamCompleteStats);
                System.out.println("Saved team stats with ID: " + savedTeamStats.getId());
            }
            
            System.out.println("=== COMPLETE GAME STATS SAVED SUCCESSFULLY ===");
            
        } catch (Exception e) {
            System.err.println("Error saving complete game stats: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    private int parseIntValue(Object value) {
        if (value == null) return 0;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                return 0;
            }
        }
        if (value instanceof Number) return ((Number) value).intValue();
        return 0;
    }

    public List<Map<String, Object>> getPlayerReport(String gameId, String playerId) {
        List<PlayerStat> stats = playerStatRepository.findByGameIdAndPlayerIdOrderByTimestampAsc(gameId, playerId);
        
        return stats.stream().map(stat -> {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("timestamp", stat.getTimestamp());
            // Calculate performance score based on positive vs negative actions
            int performance = stat.getKills() + stat.getBlocks() + stat.getAces() + stat.getDigs() + stat.getAssists() - stat.getErrors();
            dataPoint.put("value", Math.max(0, performance)); // Ensure non-negative
            return dataPoint;
        }).collect(Collectors.toList());
    }

    public Map<String, Object> getCompletedGameStats(String gameId) {
        Map<String, Object> completedStats = new HashMap<>();
        
        try {
            System.out.println("=== RETRIEVING COMPLETED GAME STATS ===");
            System.out.println("Game ID: " + gameId);
            
            // Get complete game stats from the new entity
            List<CompleteGameStats> completeStats = completeGameStatsRepository.findByGameIdOrderByPlayerIdAsc(gameId);
            System.out.println("Found " + completeStats.size() + " complete game stats records");
            
            if (!completeStats.isEmpty()) {
                // Separate team and player stats
                List<Map<String, Object>> playersList = new ArrayList<>();
                Map<String, Object> teamStatsMap = null;
                
                for (CompleteGameStats stat : completeStats) {
                    System.out.println("Processing stat record: ID=" + stat.getId() + 
                                     ", PlayerID=" + stat.getPlayerId() + 
                                     ", PlayerName=" + stat.getPlayerName() + 
                                     ", StatsData=" + stat.getStatsData());
                    
                    if ("TEAM".equals(stat.getPlayerId())) {
                        // This is team stats
                        System.out.println("Found team stats record");
                        teamStatsMap = parseStatsData(stat.getStatsData());
                        completedStats.put("score", stat.getScore());
                        completedStats.put("opponentScore", stat.getOpponentScore());
                        System.out.println("Parsed team stats: " + teamStatsMap);
                    } else {
                        // This is player stats
                        System.out.println("Found player stats record for: " + stat.getPlayerName());
                        Map<String, Object> playerMap = new HashMap<>();
                        playerMap.put("id", stat.getPlayerId());
                        playerMap.put("name", stat.getPlayerName());
                        playerMap.put("role", stat.getPlayerRole());
                        
                        Map<String, Object> parsedStats = parseStatsData(stat.getStatsData());
                        playerMap.put("stats", parsedStats);
                        playersList.add(playerMap);
                        System.out.println("Parsed player stats: " + parsedStats);
                    }
                }
                
                if (teamStatsMap != null) {
                    completedStats.put("teamStats", teamStatsMap);
                }
                
                if (!playersList.isEmpty()) {
                    completedStats.put("players", playersList);
                }
            } else {
                System.out.println("No complete game stats found for game " + gameId);
            }
            
            System.out.println("Final completed stats: " + completedStats);
            System.out.println("=== COMPLETED GAME STATS RETRIEVED ===");
            return completedStats;
            
        } catch (Exception e) {
            System.err.println("Error retrieving completed game stats: " + e.getMessage());
            e.printStackTrace();
            return new HashMap<>();
        }
    }

    public long getCompleteGameStatsCount() {
        try {
            return completeGameStatsRepository.count();
        } catch (Exception e) {
            System.err.println("Error counting CompleteGameStats: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
    
    private Map<String, Object> parseStatsData(String statsData) {
        Map<String, Object> stats = new HashMap<>();
        if (statsData == null || statsData.isEmpty()) {
            return stats;
        }
        
        try {
            // Simple but more robust JSON parsing
            // Remove { and } and split by comma
            String content = statsData.trim();
            if (content.startsWith("{") && content.endsWith("}")) {
                content = content.substring(1, content.length() - 1);
            }
            
            if (!content.isEmpty()) {
                String[] pairs = content.split(",");
                for (String pair : pairs) {
                    if (pair.trim().isEmpty()) continue;
                    
                    String[] keyValue = pair.split(":", 2);
                    if (keyValue.length == 2) {
                        String key = keyValue[0].trim().replace("\"", "");
                        String value = keyValue[1].trim();
                        
                        try {
                            // Try to parse as integer first
                            int intValue = Integer.parseInt(value);
                            stats.put(key, intValue);
                        } catch (NumberFormatException e) {
                            // If not an integer, store as string
                            stats.put(key, value);
                        }
                    }
                }
            }
            
            System.out.println("Parsed stats data: " + content + " -> " + stats);
            
        } catch (Exception e) {
            System.err.println("Error parsing stats data '" + statsData + "': " + e.getMessage());
            e.printStackTrace();
        }
        
        return stats;
    }
}
