package com.volley.controller;

import com.volley.dto.PlayerStatRequest;
import com.volley.dto.TeamStatRequest;
import com.volley.model.Player;
import com.volley.model.PlayerStat;
import com.volley.model.TeamStat;
import com.volley.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/games/{gameId}/players")
    public ResponseEntity<List<Player>> getPlayers(@PathVariable String gameId) {
        List<Player> players = statsService.getPlayersForGame(gameId);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/games/{gameId}/team-stats")
    public ResponseEntity<TeamStat> getTeamStats(@PathVariable String gameId) {
        TeamStat teamStats = statsService.getTeamStatsForGame(gameId);
        return ResponseEntity.ok(teamStats);
    }

    @GetMapping("/games/{gameId}/players/{playerId}/stats")
    public ResponseEntity<PlayerStat> getPlayerStats(@PathVariable String gameId, @PathVariable String playerId) {
        PlayerStat playerStats = statsService.getPlayerStatsForGame(gameId, playerId);
        return ResponseEntity.ok(playerStats);
    }

    @PostMapping("/games/{gameId}/players/{playerId}/stats")
    public ResponseEntity<PlayerStat> recordPlayerStat(
            @PathVariable String gameId,
            @PathVariable String playerId,
            @RequestBody PlayerStatRequest request) {
        
        PlayerStat stat = statsService.recordPlayerStat(gameId, playerId, request);
        return ResponseEntity.ok(stat);
    }

    @PostMapping("/games/{gameId}/team-stats")
    public ResponseEntity<TeamStat> recordTeamStat(
            @PathVariable String gameId,
            @RequestBody TeamStatRequest request) {
        
        TeamStat stat = statsService.recordTeamStat(gameId, request);
        return ResponseEntity.ok(stat);
    }

    @GetMapping("/games/{gameId}/reports/player/{playerId}")
    public ResponseEntity<List<Map<String, Object>>> getPlayerReport(
            @PathVariable String gameId,
            @PathVariable String playerId) {
        
        List<Map<String, Object>> report = statsService.getPlayerReport(gameId, playerId);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/games/{gameId}/completed-stats")
    public ResponseEntity<Map<String, Object>> getCompletedGameStats(@PathVariable String gameId) {
        Map<String, Object> completedStats = statsService.getCompletedGameStats(gameId);
        return ResponseEntity.ok(completedStats);
    }

    @GetMapping("/test/stats-table")
    public ResponseEntity<String> testStatsTable() {
        try {
            // Try to access the repository to see if the table exists
            long count = statsService.getCompleteGameStatsCount();
            return ResponseEntity.ok("CompleteGameStats table exists and has " + count + " records");
        } catch (Exception e) {
            return ResponseEntity.ok("Error accessing CompleteGameStats table: " + e.getMessage());
        }
    }
}
