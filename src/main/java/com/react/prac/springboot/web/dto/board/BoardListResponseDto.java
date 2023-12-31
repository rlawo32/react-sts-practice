package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

@Getter
public class BoardListResponseDto {

    private Long boardId;
    private String boardCategory;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private Long boardAuthorId;
    private String modifiedDate;
    private int boardCommentCnt;
    private int boardRecommendUpCnt;
    private int boardRecommendDownCnt;
    private int boardViewsCnt;
    private int boardNo;
    private int boardLogNo;

    public BoardListResponseDto(MainBoard mainBoard) {
        this.boardId = mainBoard.getId();
        this.boardCategory = mainBoard.getBoardCategory();
        this.boardTab = mainBoard.getBoardTab();
        this.boardTitle = mainBoard.getBoardTitle();
        this.boardContent = mainBoard.getBoardContent();
        this.boardAuthor = mainBoard.getBoardAuthor();
        this.boardAuthorId = mainBoard.getBoardAuthorId();
        this.modifiedDate = mainBoard.getModifiedDate();
        this.boardCommentCnt = mainBoard.getBoardCommentCnt();
        this.boardRecommendUpCnt = mainBoard.getBoardRecommendUpCnt();
        this.boardRecommendDownCnt = mainBoard.getBoardRecommendDownCnt();
        this.boardViewsCnt = mainBoard.getBoardViewsCnt();
    }
}
