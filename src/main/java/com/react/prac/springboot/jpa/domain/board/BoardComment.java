package com.react.prac.springboot.jpa.domain.board;

import com.react.prac.springboot.jpa.domain.member.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedDate;

import java.util.List;

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

    @Column(nullable = false)
    private Long commentParentId; // 대댓글들의 댓글 id

    @Column(columnDefinition = "integer default 0", nullable = false)
    private int commentChildCnt; // 해당 댓글에 달린 대댓글 갯수

    @Column(nullable = false)
    private Long commentTargetId; // 댓글, 대댓글이 달릴 target id

    @Column(nullable = false)
    private Long commentNestedId; // 해당 댓글의 대댓글 id

    @Column(nullable = false)
    private Long commentNestedLevel; // 해당 댓글의 대댓글 level

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

    @OneToMany(mappedBy = "boardComment", cascade = CascadeType.REMOVE)
    private List<BoardRecommend> boardRecommends;

    @Column(nullable = false)
    @CreatedDate
    private String createdDate; // 댓글 생성 일자

    @ColumnDefault("FALSE")
    @Column(nullable = false)
    private Boolean commentIsDeleted; // 삭제 여부

    @Column(columnDefinition = "integer default 0", nullable = false)
    private int commentRecommendUpCnt; // 해당 댓글 추천Up 수

    @Column(columnDefinition = "integer default 0", nullable = false)
    private int commentRecommendDownCnt; // 해당 댓글 추천Down 수

    @PostPersist
    public void postPersist() {
        if(this.commentParentId == 0) {
            this.commentParentId = this.id;
        }
    }

    @Builder
    public BoardComment(Long commentParentId, Long commentTargetId, Long commentNestedId, Long commentNestedLevel,
                        String commentContent, String commentNickname, MainBoard mainBoard, Member member,
                        String createdDate, Boolean commentIsDeleted) {
        this.commentParentId = commentParentId;
        this.commentTargetId = commentTargetId;
        this.commentNestedId = commentNestedId;
        this.commentNestedLevel = commentNestedLevel;
        this.commentContent = commentContent;
        this.commentNickname = commentNickname;
        this.mainBoard = mainBoard;
        this.member = member;
        this.createdDate = createdDate;
        this.commentIsDeleted = commentIsDeleted;
    }

    public void commentUpdate(String commentContent) {
        this.commentContent = commentContent;
    }
}
