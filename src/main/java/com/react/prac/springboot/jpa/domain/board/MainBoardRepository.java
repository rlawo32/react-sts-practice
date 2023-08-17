package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.web.dto.board.BoardResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

public interface MainBoardRepository extends JpaRepository<MainBoard, Long> {
    @Query("SELECT b FROM MainBoard b ORDER BY b.id DESC")
    List<MainBoard> findAllDesc();

    @Modifying
    @Query("UPDATE MainBoard b SET b.boardRecommendCnt = b.boardRecommendCnt + :cnt WHERE b.id = :boardId")
    void updateByBoardRecommendCount(@Param("boardId") Long boardId, @Param("cnt") int cnt);

//    @Query("SELECT m FROM MainBoard m WHERE m.boardNo = :boardNo")
//    Optional<MainBoard> findByBoardNo(@Param("") Long boardNo);
}
