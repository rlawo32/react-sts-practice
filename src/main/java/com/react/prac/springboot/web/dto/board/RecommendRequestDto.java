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

    @Builder
    public RecommendRequestDto(Long memberId, Long boardId) {
        this.memberId = memberId;
        this.boardId = boardId;
    }
}
