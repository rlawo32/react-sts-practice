package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.member.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRecommendRepository extends JpaRepository<BoardRecommend, Long> {

    @Query("SELECT r FROM BoardRecommend r WHERE r.member.id = :memberId AND r.recommendCategory = :recommendCategory")
    Page<BoardRecommend> findByBoardRecommend(@Param("memberId") Long memberId, @Param("recommendCategory") String recommendCategory, Pageable pageable);

    Optional<BoardRecommend> findByRecommendCategoryAndRecommendTypeAndMainBoardAndMember(String recommendCategory, String recommendType, MainBoard mainBoard, Member member);

    Optional<BoardRecommend> findByRecommendCategoryAndRecommendTypeAndMainBoardAndMemberAndBoardComment(String recommendCategory, String recommendType, MainBoard mainBoard, Member member, BoardComment boardComment);

    boolean existsByRecommendCategoryAndRecommendTypeAndMemberAndMainBoard(String recommendCategory, String recommendType, Member member, MainBoard mainBoard);

    boolean existsByRecommendTypeAndMemberAndBoardComment(String recommendType, Member member, BoardComment boardComment);

}
