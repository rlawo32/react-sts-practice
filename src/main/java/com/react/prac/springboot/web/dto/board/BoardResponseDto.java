package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

@Getter
public class BoardResponseDto {

    private Long boardNo;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;

    public BoardResponseDto(MainBoard entity) {
        this.boardNo = entity.getBoardNo();
        this.boardTab = entity.getBoardTab();
        this.boardTitle = entity.getBoardTitle();
        this.boardContent = entity.getBoardContent();
        this.boardAuthor = entity.getBoardAuthor();
    }
}
