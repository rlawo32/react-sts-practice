package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

@Getter
public class BoardDetailResponseDto {

    private Long boardId;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private int boardRecommendCnt;
    private int boardViewsCnt;
    // private List<CommentResponseDto> boardComments;

    public BoardDetailResponseDto(MainBoard entity) {
        this.boardId = entity.getId();
        this.boardTab = entity.getBoardTab();
        this.boardTitle = entity.getBoardTitle();
        this.boardContent = entity.getBoardContent();
        this.boardAuthor = entity.getBoardAuthor();
        this.boardRecommendCnt = entity.getBoardRecommendCnt();
        this.boardViewsCnt = entity.getBoardViewsCnt();
        // this.boardComments = entity.getBoardComments().stream().map(CommentResponseDto::new).collect(Collectors.toList());
    }
}
