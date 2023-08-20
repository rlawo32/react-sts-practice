package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.web.dto.board.BoardResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
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

    @Query("SELECT COUNT(*) FROM MainBoard")
    int findAllByCount();

    Page<MainBoard> findAll(Pageable pageable);

//    @Query("SELECT b FROM MainBoard b ORDERS LIMIT 10 OFFSET 1")
//    List<MainBoard> findALLByPaging(@Param("recordPerPage") int recordPerPage, @Param("beginPage") int beginPage);

    // 이전
    @Query("SELECT b.id FROM MainBoard b WHERE b.id > :boardId ORDER BY b.id ASC LIMIT 1")
    Long findByPrev(@Param("boardId") Long boardId);

    // 다음
    @Query("SELECT b.id FROM MainBoard b WHERE b.id < :boardId ORDER BY b.id DESC LIMIT 1")
    Long findByNext(@Param("boardId") Long boardId);

    // 모두
    @Query("SELECT b.id FROM MainBoard b WHERE b.id IN ((SELECT b2.id FROM MainBoard b2 WHERE b2.id > :boardId ORDER BY b2.id ASC LIMIT 1), (SELECT b1.id FROM MainBoard b1 WHERE b1.id < :boardId ORDER BY b1.id DESC LIMIT 1))")
    List<Long> findByPrevAndNext(@Param("boardId") Long boardId);

    @Modifying
    @Query("UPDATE MainBoard b SET b.boardRecommendCnt = b.boardRecommendCnt + :cnt WHERE b.id = :boardId")
    void updateByBoardRecommendCount(@Param("boardId") Long boardId, @Param("cnt") int cnt);

    @Modifying
    @Query("UPDATE MainBoard b SET b.boardViewsCnt = b.boardViewsCnt + 1 WHERE b.id = :boardId")
    void updateByBoardViewsCount(@Param("boardId") Long boardId);

//    @Query("SELECT m FROM MainBoard m WHERE m.boardNo = :boardNo")
//    Optional<MainBoard> findByBoardNo(@Param("") Long boardNo);
}
