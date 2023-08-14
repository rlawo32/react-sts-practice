package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.web.dto.board.BoardResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

public interface MainBoardRepository extends JpaRepository<MainBoard, Long> {
    @Query("SELECT p FROM MainBoard p ORDER BY p.id DESC")
    List<MainBoard> findAllDesc();

//    @Query("SELECT m FROM MainBoard m WHERE m.boardNo = :boardNo")
//    Optional<MainBoard> findByBoardNo(@Param("") Long boardNo);
}
