package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class BoardListResponseDto {

    private Long boardId;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private int boardRecommendCnt;
    private int boardViewsCnt;
    private String modifiedDate;

    public BoardListResponseDto(MainBoard entity) {
        this.boardId = entity.getId();
        this.boardTab = entity.getBoardTab();
        this.boardTitle = entity.getBoardTitle();
        this.boardContent = entity.getBoardContent();
        this.boardAuthor = entity.getBoardAuthor();
        this.boardRecommendCnt = entity.getBoardRecommendCnt();
        this.boardViewsCnt = entity.getBoardViewsCnt();
        this.modifiedDate = entity.getModifiedDate();
    }
}
