package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Data;
import lombok.Getter;

@Data
public class BoardDetailResponseDto {

    private Long boardId;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;
    private int boardRecommendUpCnt;
    private int boardRecommendDownCnt;
    private int boardViewsCnt;
    private int boardRecommendUpCheck; // 0 = false, 1 = true
    private int boardRecommendDownCheck; // 0 = false, 1 = true
    // private List<CommentResponseDto> boardComments;

    public BoardDetailResponseDto(MainBoard entity) {
        this.boardId = entity.getId();
        this.boardTab = entity.getBoardTab();
        this.boardTitle = entity.getBoardTitle();
        this.boardContent = entity.getBoardContent();
        this.boardAuthor = entity.getBoardAuthor();
        this.boardRecommendUpCnt = entity.getBoardRecommendUpCnt();
        this.boardRecommendDownCnt = entity.getBoardRecommendDownCnt();
        this.boardViewsCnt = entity.getBoardViewsCnt();
        // this.boardComments = entity.getBoardComments().stream().map(CommentResponseDto::new).collect(Collectors.toList());
    }
}
