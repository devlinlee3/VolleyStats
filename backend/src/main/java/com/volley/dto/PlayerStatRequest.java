package com.volley.dto;

public class PlayerStatRequest {
    private Integer kills;
    private Integer blocks;
    private Integer aces;
    private Integer digs;
    private Integer assists;
    private Integer errors;

    // Constructors
    public PlayerStatRequest() {}

    // Getters and setters
    public Integer getKills() {
        return kills;
    }

    public void setKills(Integer kills) {
        this.kills = kills;
    }

    public Integer getBlocks() {
        return blocks;
    }

    public void setBlocks(Integer blocks) {
        this.blocks = blocks;
    }

    public Integer getAces() {
        return aces;
    }

    public void setAces(Integer aces) {
        this.aces = aces;
    }

    public Integer getDigs() {
        return digs;
    }

    public void setDigs(Integer digs) {
        this.digs = digs;
    }

    public Integer getAssists() {
        return assists;
    }

    public void setAssists(Integer assists) {
        this.assists = assists;
    }

    public Integer getErrors() {
        return errors;
    }

    public void setErrors(Integer errors) {
        this.errors = errors;
    }
}
