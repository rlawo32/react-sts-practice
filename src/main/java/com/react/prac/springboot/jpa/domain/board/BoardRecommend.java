package com.react.prac.springboot.jpa.domain.board;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;


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
    private String boardTab;


    @Builder
    public BoardRecommend(String boardTab) {
        this.boardTab = boardTab;
    }
}
