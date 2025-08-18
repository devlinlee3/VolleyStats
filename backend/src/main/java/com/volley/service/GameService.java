package com.volley.service;

import com.volley.dto.CreateGameRequest;
import com.volley.model.Game;
import com.volley.model.User;
import com.volley.repository.GameRepository;
import com.volley.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StatsService statsService;

    public List<Game> getUserGames(Long userId) {
        logger.info("Fetching games for user: {}", userId);
        List<Game> games = gameRepository.findByUser_IdOrderByCreatedAtDesc(userId);
        logger.info("Found {} games for user {}", games.size(), userId);
        return games;
    }

    public List<Game> getUserGamesByStatus(Long userId, Game.GameStatus status) {
        return gameRepository.findByUser_IdAndStatusOrderByCreatedAtDesc(userId, status);
    }

    public Optional<Game> getUserGame(Long gameId, Long userId) {
        logger.info("Checking access to game {} for user {}", gameId, userId);
        Optional<Game> game = gameRepository.findByIdAndUser_Id(gameId, userId);
        if (game.isPresent()) {
            logger.info("User {} has access to game {}", userId, gameId);
        } else {
            logger.warn("User {} denied access to game {}", userId, gameId);
        }
        return game;
    }

    public boolean gameExists(Long gameId) {
        return gameRepository.existsById(gameId);
    }

    public Game createGame(CreateGameRequest request, Long userId) {
        logger.info("Creating game for user {}: {}", userId, request.getName());
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Game game = new Game();
        game.setName(request.getName());
        game.setMode(request.getMode());
        game.setUser(user);

        if (request.getPlayers() != null) {
            List<Game.GamePlayer> gamePlayers = request.getPlayers().stream()
                .map(p -> new Game.GamePlayer(p.getName(), p.getRole()))
                .toList();
            game.setPlayers(gamePlayers);
        }

        Game savedGame = gameRepository.save(game);
        logger.info("Game created successfully with ID: {}", savedGame.getId());
        
        return savedGame;
    }

    public Game updateGameScore(Long gameId, Long userId, int score, int opponentScore) {
        Game game = getUserGame(gameId, userId)
            .orElseThrow(() -> new RuntimeException("Game not found or access denied"));

        game.setScore(score);
        game.setOpponentScore(opponentScore);

        return gameRepository.save(game);
    }

    public Game completeGame(Long gameId, Long userId, Map<String, Object> finalStats) {
        Game game = getUserGame(gameId, userId)
            .orElseThrow(() -> new RuntimeException("Game not found or access denied"));

        // Save final stats before completing the game
        if (finalStats != null) {
            try {
                saveFinalStats(gameId.toString(), finalStats);
                logger.info("Final stats saved for game {} by user {}", gameId, userId);
            } catch (Exception e) {
                logger.error("Error saving final stats for game {}: {}", gameId, e.getMessage());
                // Continue with game completion even if stats saving fails
            }
        }

        game.setStatus(Game.GameStatus.COMPLETED);
        logger.info("Game {} completed by user {}", gameId, userId);

        return gameRepository.save(game);
    }

    public void saveFinalGameStats(Long gameId, Long userId, Map<String, Object> finalStats) {
        // Verify user has access to the game
        getUserGame(gameId, userId)
            .orElseThrow(() -> new RuntimeException("Game not found or access denied"));

        try {
            saveFinalStats(gameId.toString(), finalStats);
            logger.info("Final stats saved for game {} by user {}", gameId, userId);
        } catch (Exception e) {
            logger.error("Error saving final stats for game {}: {}", gameId, e.getMessage());
            throw new RuntimeException("Failed to save final stats: " + e.getMessage());
        }
    }

    private void saveFinalStats(String gameId, Map<String, Object> finalStats) {
        System.out.println("saveFinalStats called for game " + gameId + " with data: " + finalStats);
        
        try {
            // Extract game mode and scores
            String gameMode = (String) finalStats.get("gameMode");
            Integer score = (Integer) finalStats.get("score");
            Integer opponentScore = (Integer) finalStats.get("opponentScore");
            
            // Save complete game stats using the new method
            if (finalStats.containsKey("players") || finalStats.containsKey("teamStats")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> players = (List<Map<String, Object>>) finalStats.get("players");
                @SuppressWarnings("unchecked")
                Map<String, Object> teamStats = (Map<String, Object>) finalStats.get("teamStats");
                
                statsService.saveCompleteGameStats(
                    gameId, 
                    gameMode != null ? gameMode : "PLAYER",
                    players,
                    teamStats,
                    score != null ? score : 0,
                    opponentScore != null ? opponentScore : 0
                );
            }
            
            // Also save the old format for backward compatibility
            // Save player stats if in player mode
            if (finalStats.containsKey("players")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> players = (List<Map<String, Object>>) finalStats.get("players");
                System.out.println("Processing " + (players != null ? players.size() : 0) + " players");
                if (players != null) {
                    for (Map<String, Object> player : players) {
                        if (player.containsKey("stats")) {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> stats = (Map<String, Object>) player.get("stats");
                            String playerId = (String) player.get("id");
                            String playerName = (String) player.get("name");
                            
                            System.out.println("Saving stats for player " + playerName + " (ID: " + playerId + "): " + stats);
                            
                            // Save final player stats using the new method
                            // Use playerName as the ID to preserve the actual player name
                            statsService.saveFinalPlayerStats(gameId, playerName, stats);
                        }
                    }
                }
            }
            
            // Save team stats if provided
            if (finalStats.containsKey("teamStats")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> teamStats = (Map<String, Object>) finalStats.get("teamStats");
                System.out.println("Processing team stats: " + teamStats);
                if (teamStats != null) {
                    // Save final team stats using the new method
                    statsService.saveFinalTeamStats(gameId, teamStats);
                }
            }
        } catch (Exception e) {
            System.err.println("Error in saveFinalStats: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void deleteGame(Long gameId, Long userId) {
        Game game = getUserGame(gameId, userId)
            .orElseThrow(() -> new RuntimeException("Game not found or access denied"));

        gameRepository.delete(game);
    }
}
