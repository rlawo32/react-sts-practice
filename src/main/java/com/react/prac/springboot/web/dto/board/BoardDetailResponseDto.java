package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Data;

import java.util.List;

@Data
public class BoardDetailResponseDto {

    private Long boardId;
    private String boardCategory;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private Long boardAuthorId;
    private String boardAuthor;
    private String modifiedDate;
    private int boardRecommendUpCnt;
    private int boardRecommendDownCnt;
    private int boardViewsCnt;
    private int boardRecommendUpCheck; // 0 = false, 1 = true
    private int boardRecommendDownCheck; // 0 = false, 1 = true
    private List<BoardImageResponseDto> boardImageList;
    private Long loginMemberId;
    // private List<CommentResponseDto> boardComments;

    public BoardDetailResponseDto(MainBoard mainBoard) {
        this.boardId = mainBoard.getId();
        this.boardCategory = mainBoard.getBoardCategory();
        this.boardTab = mainBoard.getBoardTab();
        this.boardTitle = mainBoard.getBoardTitle();
        this.boardContent = mainBoard.getBoardContent();
        this.boardAuthorId = mainBoard.getBoardAuthorId();
        this.boardAuthor = mainBoard.getBoardAuthor();
        this.modifiedDate = mainBoard.getModifiedDate();
        this.boardRecommendUpCnt = mainBoard.getBoardRecommendUpCnt();
        this.boardRecommendDownCnt = mainBoard.getBoardRecommendDownCnt();
        this.boardViewsCnt = mainBoard.getBoardViewsCnt();
        // this.boardComments = entity.getBoardComments().stream().map(CommentResponseDto::new).collect(Collectors.toList());
    }
}
