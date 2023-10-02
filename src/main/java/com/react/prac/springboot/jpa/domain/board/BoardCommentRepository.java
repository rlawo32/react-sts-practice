package com.react.prac.springboot.jpa.domain.board;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BoardCommentRepository extends JpaRepository<BoardComment, Long> {

    @Query("SELECT c FROM BoardComment c WHERE c.mainBoard.id = :boardId")
    Page<BoardComment> findByBoardComment(@Param("boardId") Long boardId, Pageable pageable);

    @Query("SELECT c FROM BoardComment c WHERE c.member.id = :memberId")
    Page<BoardComment> findByMemberComment(@Param("memberId") Long memberId, Pageable pageable);

//    @Query("SELECT c FROM BoardComment c WHERE c.id = :commentId AND c.member.id = :memberId")
//    boolean existsByIdAndMember(@Param("commentId") Long commentId, @Param("memberId") Long memberId);

    @Modifying
    @Query("UPDATE BoardComment c SET c.commentChildCnt = c.commentChildCnt + :cnt WHERE c.id = :commentParentId")
    void updateByCommentChildCnt(@Param("commentParentId") Long commentParentId, @Param("cnt") int cnt);

    @Modifying
    @Query("UPDATE BoardComment c SET c.commentRecommendUpCnt = c.commentRecommendUpCnt + :cnt WHERE c.id = :commentId")
    void updateByCommentRecommendUpCount(@Param("commentId") Long commentId, @Param("cnt") int cnt);

    @Modifying
    @Query("UPDATE BoardComment c SET c.commentRecommendDownCnt = c.commentRecommendDownCnt + :cnt WHERE c.id = :commentId")
    void updateByCommentRecommendDownCount(@Param("commentId") Long commentId, @Param("cnt") int cnt);

    // 부모 댓글 설정 (의도한 것과 다름으로 보류)
    @Query("SELECT NVL(MAX(c.commentParentId), 0) FROM BoardComment c WHERE c.mainBoard.id = :boardId")
    Long findByNvlCommentId(@Param("boardId") Long boardId);
}
