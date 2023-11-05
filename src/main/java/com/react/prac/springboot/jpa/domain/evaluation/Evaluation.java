package com.react.prac.springboot.jpa.domain.evaluation;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@Table(name = "Evaluation")
@DynamicInsert
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "evaluation_id", nullable = false)
    private Long id;

    @Column(name = "evaluation_member_id", nullable = false)
    private Long evaluationMemberId;

    @Column(name = "evaluation_member_nickname", nullable = false)
    private String evaluationMemberNickname;

    @Column(name = "evaluation_function_rating", nullable = false)
    private int evaluationFunctionRating;

    @Column(name = "evaluation_design_rating", nullable = false)
    private int evaluationDesignRating;

    @Column(name = "evaluation_title", nullable = false)
    private String evaluationTitle;

    @Column(name = "evaluation_content", nullable = false)
    private String evaluationContent;

    @Column(name = "evaluation_login_yn", nullable = false)
    private String evaluationLoginYn;

    @Column(nullable = false)
    @CreatedDate
    private String createdDate;

    @Builder
    public Evaluation(Long evaluationMemberId, String evaluationMemberNickname, int evaluationFunctionRating,
                      int evaluationDesignRating, String evaluationTitle, String evaluationContent,
                      String evaluationLoginYn, String createdDate) {
        this.evaluationMemberId = evaluationMemberId;
        this.evaluationMemberNickname = evaluationMemberNickname;
        this.evaluationFunctionRating = evaluationFunctionRating;
        this.evaluationDesignRating = evaluationDesignRating;
        this.evaluationTitle = evaluationTitle;
        this.evaluationContent = evaluationContent;
        this.evaluationLoginYn = evaluationLoginYn;
        this.createdDate = createdDate;
    }

}
