package com.volley.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_stats")
public class TeamStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gameId;

    private int totalPoints = 0;
    private int errors = 0;
    private int missedServes = 0;
    private int aces = 0;
    private int timeouts = 0;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    // Constructors
    public TeamStat() {
        this.timestamp = LocalDateTime.now();
    }

    public TeamStat(String gameId) {
        this.gameId = gameId;
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

    public int getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(int totalPoints) {
        this.totalPoints = totalPoints;
    }

    public int getErrors() {
        return errors;
    }

    public void setErrors(int errors) {
        this.errors = errors;
    }

    public int getMissedServes() {
        return missedServes;
    }

    public void setMissedServes(int missedServes) {
        this.missedServes = missedServes;
    }

    public int getAces() {
        return aces;
    }

    public void setAces(int aces) {
        this.aces = aces;
    }

    public int getTimeouts() {
        return timeouts;
    }

    public void setTimeouts(int timeouts) {
        this.timeouts = timeouts;
    }

    public String getTimestamp() {
        return timestamp.toString();
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
