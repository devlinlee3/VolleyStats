package com.volley.repository;

import com.volley.model.CompleteGameStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompleteGameStatsRepository extends JpaRepository<CompleteGameStats, Long> {
    List<CompleteGameStats> findByGameIdOrderByPlayerIdAsc(String gameId);
    List<CompleteGameStats> findByGameIdAndGameMode(String gameId, String gameMode);
}

