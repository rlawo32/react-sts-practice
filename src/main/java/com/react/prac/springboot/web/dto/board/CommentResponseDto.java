package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.BoardComment;
import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Data
public class CommentResponseDto {

    private Long commentId;
    private Long commentParentId;
    private Long commentTargetId;
    private Long commentNestedId;
    private Long commentNestedLevel;
    private String commentContent;
    private Long boardId;
    private Long memberId;
    private String memberNickname;
    private String createdDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
    private int commentRecommendUpCnt;
    private int commentRecommendDownCnt;
    private int commentRecommendUpCheck; // 0 = false, 1 = true
    private int commentRecommendDownCheck; // 0 = false, 1 = true
    private int commentLogNo;
    private String commentBoardCategory;

    public CommentResponseDto(BoardComment boardComment) {
        this.commentId = boardComment.getId();
        this.commentParentId = boardComment.getCommentParentId();
        this.commentTargetId = boardComment.getCommentTargetId();
        this.commentNestedId = boardComment.getCommentNestedId();
        this.commentNestedLevel = boardComment.getCommentNestedLevel();
        this.commentContent = boardComment.getCommentContent();
        this.boardId = boardComment.getMainBoard().getId();
        this.memberId = boardComment.getMember().getId();
        this.memberNickname = boardComment.getCommentNickname();
        this.createdDate = boardComment.getCreatedDate();
        this.commentRecommendUpCnt = boardComment.getCommentRecommendUpCnt();
        this.commentRecommendDownCnt = boardComment.getCommentRecommendDownCnt();
    }
}
