package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class BoardListResponseDto {

    private Long boardId;
    private String boardCategory;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private int boardRecommendUpCnt;
    private int boardRecommendDownCnt;
    private int boardViewsCnt;
    private int boardLogNo;
    private String modifiedDate;

    public BoardListResponseDto(MainBoard mainBoard) {
        this.boardId = mainBoard.getId();
        this.boardCategory = mainBoard.getBoardCategory();
        this.boardTab = mainBoard.getBoardTab();
        this.boardTitle = mainBoard.getBoardTitle();
        this.boardContent = mainBoard.getBoardContent();
        this.boardAuthor = mainBoard.getBoardAuthor();
        this.boardRecommendUpCnt = mainBoard.getBoardRecommendUpCnt();
        this.boardRecommendDownCnt = mainBoard.getBoardRecommendDownCnt();
        this.boardViewsCnt = mainBoard.getBoardViewsCnt();
        this.modifiedDate = mainBoard.getModifiedDate();
    }
}
