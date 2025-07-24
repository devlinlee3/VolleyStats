package com.volley.dto;

public class TeamStatRequest {
    private Integer totalPoints;
    private Integer errors;
    private Integer missedServes;
    private Integer aces;
    private Integer timeouts;

    // Constructors
    public TeamStatRequest() {}

    // Getters and setters
    public Integer getTotalPoints() {
        return totalPoints;
    }

    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }

    public Integer getErrors() {
        return errors;
    }

    public void setErrors(Integer errors) {
        this.errors = errors;
    }

    public Integer getMissedServes() {
        return missedServes;
    }

    public void setMissedServes(Integer missedServes) {
        this.missedServes = missedServes;
    }

    public Integer getAces() {
        return aces;
    }

    public void setAces(Integer aces) {
        this.aces = aces;
    }

    public Integer getTimeouts() {
        return timeouts;
    }

    public void setTimeouts(Integer timeouts) {
        this.timeouts = timeouts;
    }
}
