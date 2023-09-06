package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.user.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRecommendRepository extends JpaRepository<BoardRecommend, Long> {

    Optional<BoardRecommend> findByRecommendCategoryAndRecommendTypeAndMainBoardAndMember(String recommendCategory, String recommendType, MainBoard mainBoard, Member member);

    Optional<BoardRecommend> findByRecommendCategoryAndRecommendTypeAndMainBoardAndMemberAndBoardComment(String recommendCategory, String recommendType, MainBoard mainBoard, Member member, BoardComment boardComment);

    boolean existsByRecommendCategoryAndRecommendTypeAndMemberAndMainBoard(String recommendCategory, String recommendType, Member member, MainBoard mainBoard);

    boolean existsByRecommendTypeAndMemberAndBoardComment(String recommendType, Member member, BoardComment boardComment);

}
