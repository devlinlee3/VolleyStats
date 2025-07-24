package com.volley.service;

import com.volley.dto.PlayerStatRequest;
import com.volley.dto.TeamStatRequest;
import com.volley.model.Player;
import com.volley.model.PlayerStat;
import com.volley.model.TeamStat;
import com.volley.repository.PlayerRepository;
import com.volley.repository.PlayerStatRepository;
import com.volley.repository.TeamStatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatsService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PlayerStatRepository playerStatRepository;

    @Autowired
    private TeamStatRepository teamStatRepository;

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
}
