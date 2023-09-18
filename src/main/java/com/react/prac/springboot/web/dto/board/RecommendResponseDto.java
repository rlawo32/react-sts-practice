package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.BoardRecommend;
import lombok.Data;

@Data
public class RecommendResponseDto {

    private Long recommendId;
    private String recommendType;
    private String recommendCategory;
    private Long boardId;
    private Long commentId;
    private String createdDate;
    private String targetAuthor;
    private String targetData;
    private int recommendLogNo;

    public RecommendResponseDto(BoardRecommend boardRecommend) {
        this.recommendId = boardRecommend.getId();
        this.recommendType = boardRecommend.getRecommendType();
        this.recommendCategory = boardRecommend.getRecommendCategory();
        this.boardId = boardRecommend.getMainBoard().getId();
        if(boardRecommend.getBoardComment() == null) {
            this.commentId = 0L;
        } else {
            this.commentId = boardRecommend.getBoardComment().getId();
        }
        this.createdDate = boardRecommend.getCreatedDate();
    }
}
