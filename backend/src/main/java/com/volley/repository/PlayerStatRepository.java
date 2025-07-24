package com.volley.repository;

import com.volley.model.PlayerStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerStatRepository extends JpaRepository<PlayerStat, Long> {
    List<PlayerStat> findByGameIdAndPlayerIdOrderByTimestampAsc(String gameId, String playerId);
    List<PlayerStat> findByGameIdOrderByTimestampAsc(String gameId);
}
