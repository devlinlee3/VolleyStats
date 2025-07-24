package com.volley.repository;

import com.volley.model.TeamStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamStatRepository extends JpaRepository<TeamStat, Long> {
    Optional<TeamStat> findByGameId(String gameId);
}
