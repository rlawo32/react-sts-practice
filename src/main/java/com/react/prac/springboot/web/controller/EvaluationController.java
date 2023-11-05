package com.react.prac.springboot.web.controller;

import com.react.prac.springboot.service.evaluations.EvaluationService;
import com.react.prac.springboot.web.dto.CommonResponseDto;
import com.react.prac.springboot.web.dto.evaluation.EvaluationSaveRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/evaluation")
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping("/evaluationSave")
    public CommonResponseDto<?> evaluationSave(@RequestBody EvaluationSaveRequestDto requestDto) {

        CommonResponseDto<?> result = evaluationService.evaluationInsert(requestDto);

        return result;
    }

    @GetMapping("/evaluationList")
    public Map<String, Object> evaluationList(HttpServletRequest request) {

        return evaluationService.evaluationAllList(request);
    }

}
