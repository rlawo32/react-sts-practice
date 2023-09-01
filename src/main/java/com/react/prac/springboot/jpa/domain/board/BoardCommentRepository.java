package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.user.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

    @Query("SELECT c FROM BoardComment c WHERE c.mainBoard.id = :boardId")
    Page<BoardComment> findByBoardComment(@Param("boardId") Long boardId, Pageable pageable);

    // 부모 댓글 설정
    @Query("SELECT NVL(MAX(c.commentParentId), 0) FROM BoardComment c WHERE c.mainBoard.id = :boardId")
    Long findByNvlCommentId(@Param("boardId") Long boardId);
}
