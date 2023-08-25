package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.user.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
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

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id") // recommend_member_id 로 변경하기
    private Member member;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "board_id") // recommend_board_id 로 변경하기
    private MainBoard mainBoard;

    @Builder
    public BoardRecommend(MainBoard mainBoard, Member member) {
        this.mainBoard = mainBoard;
        this.member = member;
    }
}
