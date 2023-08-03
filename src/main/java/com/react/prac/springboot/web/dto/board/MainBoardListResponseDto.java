package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MainBoardListResponseDto {

    private Long boardNo;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private LocalDateTime modifiedDate;

    public MainBoardListResponseDto(MainBoard entity) {
        this.boardNo = entity.getBoardNo();
        this.boardTab = entity.getBoardTab();
        this.boardTitle = entity.getBoardTitle();
        this.boardContent = entity.getBoardContent();
        this.boardAuthor = entity.getBoardAuthor();
        this.modifiedDate = entity.getModifiedDate();
    }
}
