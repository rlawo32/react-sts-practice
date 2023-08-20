package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

@Getter
public class BoardResponseDto {

    private Long boardId;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private int boardRecommendCnt;
    private int boardViewsCnt;

    public BoardResponseDto(MainBoard entity) {
        this.boardId = entity.getId();
        this.boardTab = entity.getBoardTab();
        this.boardTitle = entity.getBoardTitle();
        this.boardContent = entity.getBoardContent();
        this.boardAuthor = entity.getBoardAuthor();
        this.boardRecommendCnt = entity.getBoardRecommendCnt();
        this.boardViewsCnt = entity.getBoardViewsCnt();
    }
}
