package com.volley.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "player_stats")
public class PlayerStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gameId;

    @Column(nullable = false)
    private String playerId;

    private int kills = 0;
    private int blocks = 0;
    private int aces = 0;
    private int digs = 0;
    private int assists = 0;
    private int errors = 0;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Constructors
    public PlayerStat() {
        this.timestamp = LocalDateTime.now();
    }

    public PlayerStat(String gameId, String playerId) {
        this.gameId = gameId;
        this.playerId = playerId;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() {
        return id != null ? id.toString() : null;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public int getKills() {
        return kills;
    }

    public void setKills(int kills) {
        this.kills = kills;
    }

    public int getBlocks() {
        return blocks;
    }

    public void setBlocks(int blocks) {
        this.blocks = blocks;
    }

    public int getAces() {
        return aces;
    }

    public void setAces(int aces) {
        this.aces = aces;
    }

    public int getDigs() {
        return digs;
    }

    public void setDigs(int digs) {
        this.digs = digs;
    }

    public int getAssists() {
        return assists;
    }

    public void setAssists(int assists) {
        this.assists = assists;
    }

    public int getErrors() {
        return errors;
    }

    public void setErrors(int errors) {
        this.errors = errors;
    }

    public String getTimestamp() {
        return timestamp.toString();
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
