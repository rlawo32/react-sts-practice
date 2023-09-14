package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

@Getter
public class RecommendResponseDto {

    private Long boardId;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;

    public RecommendResponseDto(MainBoard mainBoard) {
        this.boardId = mainBoard.getId();
        this.boardTab = mainBoard.getBoardTab();
        this.boardTitle = mainBoard.getBoardTitle();
        this.boardContent = mainBoard.getBoardContent();
        this.boardAuthor = mainBoard.getBoardAuthor();
    }
}
