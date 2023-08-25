package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.user.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import static jakarta.persistence.FetchType.LAZY;


@Data
@NoArgsConstructor // LOMBOK Annotation
@Entity // JPA Annotation
@Table(name = "BoardComment")
public class BoardComment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id; // 댓글 pk

    @Column(columnDefinition = "TEXT", nullable = false)
    private String commentContent; // 댓글 내용

    @Column(nullable = false)
    private String commentNickname; // 댓글 작성자 닉네임

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "board_id")
    private MainBoard mainBoard; // 게시글 id (댓글의 그룹번호)

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member; // 댓글 작성자 id

//    @Column(nullable = false)
//    private Long commentGroupId; // 댓글 id (대댓글의 그룹번호)

    @Column(nullable = false)
    @CreatedDate
    private String createdDate; // 댓글 생성 일자

    @Column(nullable = false)
    @LastModifiedDate
    private String modifiedDate; // 댓글 수정 일자

    @ColumnDefault("FALSE")
    @Column(nullable = false)
    private Boolean commentIsDeleted; // 삭제 여부

    @Builder
    public BoardComment(String commentContent, String commentNickname, MainBoard mainBoard, Member member, String createdDate, String modifiedDate, Boolean commentIsDeleted) {
        this.commentContent = commentContent;
        this.commentNickname = commentNickname;
        this.mainBoard = mainBoard;
        this.member = member;
//        this.commentGroupId = commentGroupId;
        this.createdDate = createdDate;
        this.modifiedDate = modifiedDate;
        this.commentIsDeleted = commentIsDeleted;
    }
}
