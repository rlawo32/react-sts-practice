package com.react.prac.springboot.web.dto.board;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecommendRequestDto {

    private Long boardId;
    private Long commentId;
    private String recommendType; // U : 좋아요, D : 싫어요

    @Builder
    public RecommendRequestDto(Long boardId, Long commentId, String recommendType) {
        this.boardId = boardId;
        this.commentId = commentId;
        this.recommendType = recommendType;
    }
}
