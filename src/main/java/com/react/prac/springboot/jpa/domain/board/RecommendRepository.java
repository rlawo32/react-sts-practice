package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.user.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.font.OpenType;
import java.util.Optional;

public interface RecommendRepository extends JpaRepository<BoardRecommend, Long> {
    Optional<BoardRecommend> findByBoardAndMember(MainBoard mainBoard, Member member);
}
