package com.react.prac.springboot.jpa.domain.board;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MainBoardRepository extends JpaRepository<MainBoard, Long> {
    @Query("SELECT p FROM MainBoard p ORDER BY p.id DESC")
    List<com.react.prac.springboot.jpa.domain.board.MainBoard> findAllDesc();
}
