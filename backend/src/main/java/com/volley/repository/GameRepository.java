package com.volley.repository;

import com.volley.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
    List<Game> findByUser_IdOrderByCreatedAtDesc(Long userId);
    Optional<Game> findByIdAndUser_Id(Long id, Long userId);
    List<Game> findByUser_IdAndStatusOrderByCreatedAtDesc(Long userId, Game.GameStatus status);
}
