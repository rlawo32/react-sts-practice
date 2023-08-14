package com.react.prac.springboot.jpa.domain.board;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Getter // LOMBOK Annotation
@NoArgsConstructor // LOMBOK Annotation
@Entity // JPA Annotation
public class MainBoard extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키 매핑, id값을 null로 하면 db가 알아서 auto_increment 해준다.
    @Column(name = "board_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String boardTab; // 게시물 탭

    @Column(length = 500, nullable = false)
    private String boardTitle;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String boardContent;

    @Column(nullable = false)
    private String boardAuthor;

    @Builder
    public MainBoard(String boardTab, String boardTitle, String boardContent, String boardAuthor) {
        this.boardTab = boardTab;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
        this.boardAuthor = boardAuthor;
    }

    public void update(String boardTitle, String boardContent) {
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
    }
}
