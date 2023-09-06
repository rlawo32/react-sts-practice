package com.react.prac.springboot.jpa.domain.board;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MainBoardRepository extends JpaRepository<MainBoard, Long> {

    Page<MainBoard> findAll(Pageable pageable);

    Page<MainBoard> findAllByBoardTab(String boardTab, Pageable pageable);

    Page<MainBoard> findAllByBoardTitleContaining(String boardTitle, Pageable pageable);

    Page<MainBoard> findAllByBoardContentContaining(String boardContent, Pageable pageable);

    Page<MainBoard> findAllByBoardAuthorContaining(String boardAuthor, Pageable pageable);

    Page<MainBoard> findAllByBoardTabAndBoardTitleContaining(String boardTab, String boardTitle, Pageable pageable);

    Page<MainBoard> findAllByBoardTabAndBoardContentContaining(String boardTab, String boardContent, Pageable pageable);

    Page<MainBoard> findAllByBoardTabAndBoardAuthorContaining(String boardTab, String boardAuthor, Pageable pageable);


    // 이전
    @Query("SELECT b.id FROM MainBoard b WHERE b.id < :boardId ORDER BY b.id DESC LIMIT 1")
    Long findByPrev(@Param("boardId") Long boardId);

    // 다음
    @Query("SELECT b.id FROM MainBoard b WHERE b.id > :boardId ORDER BY b.id ASC LIMIT 1")
    Long findByNext(@Param("boardId") Long boardId);

    @Modifying
    @Query("UPDATE MainBoard b SET b.boardRecommendUpCnt = b.boardRecommendUpCnt + :cnt WHERE b.id = :boardId")
    void updateByBoardRecommendUpCount(@Param("boardId") Long boardId, @Param("cnt") int cnt);

    @Modifying
    @Query("UPDATE MainBoard b SET b.boardRecommendDownCnt = b.boardRecommendDownCnt + :cnt WHERE b.id = :boardId")
    void updateByBoardRecommendDownCount(@Param("boardId") Long boardId, @Param("cnt") int cnt);

    @Modifying
    @Query("UPDATE MainBoard b SET b.boardViewsCnt = b.boardViewsCnt + 1 WHERE b.id = :boardId")
    void updateByBoardViewsCount(@Param("boardId") Long boardId);

}
