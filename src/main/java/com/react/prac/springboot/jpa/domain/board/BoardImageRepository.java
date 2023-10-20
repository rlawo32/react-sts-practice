package com.react.prac.springboot.jpa.domain.board;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {

    @Query("SELECT i FROM BoardImage i WHERE i.mainBoard.id = :boardId")
    List<BoardImage> findBoardImageByBoardId(@Param("boardId") Long boardId);

    @Modifying
    @Query("DELETE FROM BoardImage i WHERE i.mainBoard.id = :boardId AND i.boardImageOriginName = :boardImageOriginName")
    void deleteByBoardImageOriginName(@Param("boardId") Long boardId, @Param("boardImageOriginName") String boardImageOriginName);

    boolean existsByMainBoard(MainBoard mainBoard);
}
