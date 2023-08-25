package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.BoardComment;
import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
public class CommentResponseDto {

    private Long commentId;
    private String commentContent;
    private Long boardId;
    private Long memberId;
    private String memberNickname;
    private String createdDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    private String modifiedDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));

    public CommentResponseDto(BoardComment entity) {
        this.commentId = entity.getId();
        this.commentContent = entity.getCommentContent();
        this.boardId = entity.getMainBoard().getId();
        this.memberId = entity.getMember().getId();
        this.memberNickname = entity.getCommentNickname();
        this.createdDate = entity.getCreatedDate();
        this.modifiedDate = entity.getModifiedDate();
    }
}
