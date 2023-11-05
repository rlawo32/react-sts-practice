package com.react.prac.springboot.service.evaluations;

import com.react.prac.springboot.config.security.SecurityUtil;
import com.react.prac.springboot.jpa.domain.evaluation.Evaluation;
import com.react.prac.springboot.jpa.domain.evaluation.EvaluationRepository;
import com.react.prac.springboot.jpa.domain.member.Member;
import com.react.prac.springboot.jpa.domain.member.MemberRepository;
import com.react.prac.springboot.web.dto.CommonResponseDto;
import com.react.prac.springboot.web.dto.evaluation.EvaluationListResponseDto;
import com.react.prac.springboot.web.dto.evaluation.EvaluationSaveRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public CommonResponseDto<?> evaluationInsert(EvaluationSaveRequestDto requestDto) {
        try {
            if(SecurityUtil.getCurrentMemberId() != null) {
                Member member = memberRepository.findById(SecurityUtil.getCurrentMemberId())
                        .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

                requestDto.setEvaluationMemberId(member.getId());
                requestDto.setEvaluationMemberNickname(member.getMemberNickname());
                requestDto.setEvaluationLoginYn("Y");

                evaluationRepository.save(requestDto.toEntity());
            } else {
                requestDto.setEvaluationMemberId(0L);
                requestDto.setEvaluationLoginYn("N");

                evaluationRepository.save(requestDto.toEntity());
            }
        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!!");
        }

        return CommonResponseDto.setSuccess("Evaluation Insert Success!!", null);
    }

    @Transactional
    public Map<String, Object> evaluationAllList(HttpServletRequest request) {

        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지
        int totalPage = 0;
        Long totalData = 0L;

        Long totalFunctionRating = evaluationRepository.findAllFunctionRating();
        Long totalDesignRating = evaluationRepository.findAllDesignRating();

        Page<Evaluation> pageable = evaluationRepository.
                findAll(PageRequest.of(page, recordPerPage, Sort.by("id").descending()));

        List<EvaluationListResponseDto> pagingList = pageable.stream()
                .map(EvaluationListResponseDto::new)
                .collect(Collectors.toList());


        totalPage = pageable.getTotalPages();
        totalData = pageable.getTotalElements();

        Map<String, Object> result = new HashMap<>();
        result.put("evaluationList", pagingList);
        result.put("totalFunctionRating", totalFunctionRating);
        result.put("totalDesignRating", totalDesignRating);
        result.put("totalPage", totalPage);
        result.put("totalData", totalData);

        return result;
    }

}
