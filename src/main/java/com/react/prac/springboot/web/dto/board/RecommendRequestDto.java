package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RecommendRequestDto {

    private Long memberId;
    private Long boardId;
    private Long commentId;
    private String recommendType; // U : 좋아요, D : 싫어요

    @Builder
    public RecommendRequestDto(Long memberId, Long boardId, Long commentId, String recommendType) {
        this.memberId = memberId;
        this.boardId = boardId;
        this.commentId = commentId;
        this.recommendType = recommendType;
    }
}
