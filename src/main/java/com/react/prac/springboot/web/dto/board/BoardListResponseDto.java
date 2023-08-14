package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardListResponseDto {

    private Long boardId;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private LocalDateTime modifiedDate;

    public BoardListResponseDto(MainBoard entity) {
        this.boardId = entity.getId();
        this.boardTab = entity.getBoardTab();
        this.boardTitle = entity.getBoardTitle();
        this.boardContent = entity.getBoardContent();
        this.boardAuthor = entity.getBoardAuthor();
        this.modifiedDate = entity.getModifiedDate();
    }
}
