package com.volley.controller;

import com.volley.dto.CreateGameRequest;
import com.volley.model.Game;
import com.volley.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @GetMapping
    public ResponseEntity<List<Game>> getUserGames() {
        Long userId = getCurrentUserId();
        List<Game> games = gameService.getUserGames(userId);
        return ResponseEntity.ok(games);
    }

    @GetMapping("/{gameId}")
    public ResponseEntity<Game> getUserGame(@PathVariable Long gameId) {
        Long userId = getCurrentUserId();
        System.out.println("GameController: User " + userId + " requesting game " + gameId);
        
        // First check if the game exists at all
        if (!gameService.gameExists(gameId)) {
            System.out.println("GameController: Game " + gameId + " not found");
            return ResponseEntity.notFound().build();
        }
        
        // Then check if user has access to it
        return gameService.getUserGame(gameId, userId)
            .map(game -> {
                System.out.println("GameController: User " + userId + " granted access to game " + gameId);
                return ResponseEntity.ok(game);
            })
            .orElseGet(() -> {
                System.out.println("GameController: User " + userId + " denied access to game " + gameId);
                return ResponseEntity.status(403).build();
            });
    }

    @PostMapping
    public ResponseEntity<Game> createGame(@RequestBody CreateGameRequest request) {
        Long userId = getCurrentUserId();
        Game game = gameService.createGame(request, userId);
        return ResponseEntity.ok(game);
    }

    @PutMapping("/{gameId}/score")
    public ResponseEntity<Game> updateGameScore(
            @PathVariable Long gameId,
            @RequestParam int score,
            @RequestParam int opponentScore) {
        Long userId = getCurrentUserId();
        try {
            Game game = gameService.updateGameScore(gameId, userId, score, opponentScore);
            return ResponseEntity.ok(game);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{gameId}/complete")
    public ResponseEntity<Game> completeGame(@PathVariable Long gameId, @RequestBody(required = false) Map<String, Object> finalStats) {
        Long userId = getCurrentUserId();
        try {
            Game game = gameService.completeGame(gameId, userId, finalStats);
            return ResponseEntity.ok(game);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{gameId}/final-stats")
    public ResponseEntity<String> saveFinalGameStats(@PathVariable Long gameId, @RequestBody Map<String, Object> finalStats) {
        Long userId = getCurrentUserId();
        try {
            gameService.saveFinalGameStats(gameId, userId, finalStats);
            return ResponseEntity.ok("Final stats saved successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Failed to save final stats: " + e.getMessage());
        }
    }

    @DeleteMapping("/{gameId}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long gameId) {
        Long userId = getCurrentUserId();
        try {
            gameService.deleteGame(gameId, userId);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("GameController: Authentication principal type: " + 
            (authentication != null ? authentication.getPrincipal().getClass().getSimpleName() : "null"));
        
        if (authentication != null && authentication.getPrincipal() instanceof com.volley.security.CustomUserDetails) {
            Long userId = ((com.volley.security.CustomUserDetails) authentication.getPrincipal()).getUserId();
            System.out.println("GameController: Extracted user ID: " + userId);
            return userId;
        }
        throw new RuntimeException("User not authenticated");
    }
}
