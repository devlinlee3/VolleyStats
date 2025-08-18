package com.volley.dto;

import com.volley.model.Game;
import java.util.List;

public class CreateGameRequest {
    private String name;
    private Game.GameMode mode;
    private List<GamePlayer> players;

    public static class GamePlayer {
        private String name;
        private String role;

        public GamePlayer() {}

        public GamePlayer(String name, String role) {
            this.name = name;
            this.role = role;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }
    }

    // Constructors
    public CreateGameRequest() {}

    public CreateGameRequest(String name, Game.GameMode mode, List<GamePlayer> players) {
        this.name = name;
        this.mode = mode;
        this.players = players;
    }

    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Game.GameMode getMode() {
        return mode;
    }

    public void setMode(Game.GameMode mode) {
        this.mode = mode;
    }

    public List<GamePlayer> getPlayers() {
        return players;
    }

    public void setPlayers(List<GamePlayer> players) {
        this.players = players;
    }
}
