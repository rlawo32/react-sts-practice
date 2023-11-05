package com.react.prac.springboot.web.dto.evaluation;

import com.react.prac.springboot.jpa.domain.evaluation.Evaluation;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class EvaluationSaveRequestDto {

    private Long evaluationMemberId;
    private String evaluationMemberNickname;
    private int evaluationFunctionRating;
    private int evaluationDesignRating;
    private String evaluationTitle;
    private String evaluationContent;
    private String evaluationLoginYn;
    private String createdDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));

    public Evaluation toEntity() {
        return Evaluation.builder()
                .evaluationMemberId(evaluationMemberId)
                .evaluationMemberNickname(evaluationMemberNickname)
                .evaluationFunctionRating(evaluationFunctionRating)
                .evaluationDesignRating(evaluationDesignRating)
                .evaluationTitle(evaluationTitle)
                .evaluationContent(evaluationContent)
                .evaluationLoginYn(evaluationLoginYn)
                .createdDate(createdDate)
                .build();
    }

}
