package com.react.prac.springboot.web.dto.evaluation;

import com.react.prac.springboot.jpa.domain.evaluation.Evaluation;
import lombok.Getter;

@Getter
public class EvaluationListResponseDto {

    private Long evaluationId;
    private Long evaluationMemberId;
    private String evaluationMemberNickname;
    private int evaluationFunctionRating;
    private int evaluationDesignRating;
    private String evaluationTitle;
    private String evaluationContent;
    private String evaluationLoginYn;
    private String createdDate;
    private int evaluationNo;

    public EvaluationListResponseDto(Evaluation evaluation) {
        this.evaluationId = evaluation.getId();
        this.evaluationMemberId = evaluation.getEvaluationMemberId();
        this.evaluationMemberNickname = evaluation.getEvaluationMemberNickname();
        this.evaluationFunctionRating = evaluation.getEvaluationFunctionRating();
        this.evaluationDesignRating = evaluation.getEvaluationDesignRating();
        this.evaluationTitle = evaluation.getEvaluationTitle();
        this.evaluationContent = evaluation.getEvaluationContent();
        this.evaluationLoginYn = evaluation.getEvaluationLoginYn();
        this.createdDate = evaluation.getCreatedDate();
    }
}
