package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.member.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;


@Data
@NoArgsConstructor // LOMBOK Annotation
@Entity // JPA Annotation
@Table(name = "BoardRecommend")
public class BoardRecommend extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommend_id")
    private Long id;

    @Column(nullable = false)
    private String recommendType; // U : 좋아요, D : 싫어요

    @Column(nullable = false)
    private String recommendCategory; // B : BOARD, C : COMMENT

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "board_id")
    private MainBoard mainBoard;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "comment_id")
    private BoardComment boardComment;

    @Builder
    public BoardRecommend(String recommendType, String recommendCategory, Member member, MainBoard mainBoard, BoardComment boardComment) {
        this.recommendType = recommendType;
        this.recommendCategory = recommendCategory;
        this.member = member;
        this.mainBoard = mainBoard;
        this.boardComment = boardComment;
    }
}
