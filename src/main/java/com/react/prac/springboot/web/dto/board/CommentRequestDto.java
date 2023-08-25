package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.BoardComment;
import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@NoArgsConstructor
public class CommentRequestDto {

    private Long memberId;
    private Long boardId;
    private String commentContent;
    private String createdDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    private String modifiedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));

    @Builder
    public CommentRequestDto(Long memberId, Long boardId, String commentContent, String createdDate, String modifiedDate) {
        this.memberId = memberId;
        this.boardId = boardId;
        this.commentContent = commentContent;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
    }
}
