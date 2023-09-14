package com.react.prac.springboot.jpa.domain.board;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;


@Getter // LOMBOK Annotation
@NoArgsConstructor // LOMBOK Annotation
@Entity // JPA Annotation
public class MainBoard extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 기본키 매핑, id값을 null로 하면 db가 알아서 auto_increment 해준다.
    @Column(name = "board_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String boardCategory; // 게시물 탭

    @Column(nullable = false)
    private String boardTab; // 게시물 탭

    @Column(length = 500, nullable = false)
    private String boardTitle;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String boardContent;

    @Column(nullable = false)
    private Long boardAuthorId;

    @Column(nullable = false)
    private String boardAuthor;

    @Column(columnDefinition = "integer default 0", nullable = false)
    private int boardRecommendUpCnt;

    @Column(columnDefinition = "integer default 0", nullable = false)
    private int boardRecommendDownCnt;

    // @Column(columnDefinition = "integer default 0", nullable = false)	// 조회수의 기본 값을 0으로 지정, null 불가 처리
    @Column(columnDefinition = "integer default 0", nullable = false)
    private int boardViewsCnt;

    @Column(columnDefinition = "integer default 0", nullable = false)
    private int boardCommentCnt;

//    @OneToMany(mappedBy = "mainBoard", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
//    @OrderBy("id asc") // 댓글 정렬
//    private List<BoardComment> boardComments;

    @Builder
    public MainBoard(String boardCategory, String boardTab, String boardTitle, String boardContent, Long boardAuthorId, String boardAuthor) {
        this.boardCategory = boardCategory;
        this.boardTab = boardTab;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
        this.boardAuthorId = boardAuthorId;
        this.boardAuthor = boardAuthor;
    }

    public void update(String boardTitle, String boardContent) {
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
    }
}
