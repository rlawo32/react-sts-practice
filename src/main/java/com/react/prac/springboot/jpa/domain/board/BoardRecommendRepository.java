package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.user.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface BoardRecommendRepository extends JpaRepository<BoardRecommend, Long> {

    Optional<BoardRecommend> findByRecommendTypeAndMainBoardAndMember(String recommendType, MainBoard mainBoard, Member member);

    Optional<BoardRecommend> findByRecommendTypeAndMainBoardAndMemberAndBoardComment(String recommendType, MainBoard mainBoard, Member member, BoardComment boardComment);

}
