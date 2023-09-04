package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.user.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

    @Query("SELECT c FROM BoardComment c WHERE c.mainBoard.id = :boardId")
    Page<BoardComment> findByBoardComment(@Param("boardId") Long boardId, Pageable pageable);

    @Modifying
    @Query("UPDATE BoardComment c SET c.commentParentId = :commentParentId WHERE c.id = :commentParentId")
    void updateByCommentParentId(@Param("commentParentId") Long commentParentId);

    // 부모 댓글 설정 (의도한 것과 다름으로 보류)
    @Query("SELECT NVL(MAX(c.commentParentId), 0) FROM BoardComment c WHERE c.mainBoard.id = :boardId")
    Long findByNvlCommentId(@Param("boardId") Long boardId);
}
