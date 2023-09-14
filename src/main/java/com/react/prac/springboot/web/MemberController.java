package com.react.prac.springboot.web;

import com.react.prac.springboot.config.auth.SecurityUtil;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.service.users.MemberService;
import com.react.prac.springboot.util.EmailUtil;
import com.react.prac.springboot.web.dto.*;
import com.react.prac.springboot.web.dto.user.MemberInfoResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInRequestDto;
import com.react.prac.springboot.web.dto.user.MemberSignInResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignUpRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// @CrossOrigin(originPatterns = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/sendAuthCode")
    public Map<String, Object> sendAuthCode(HttpServletRequest request) {

        return EmailUtil.sendAuthCode(request.getParameter("userEmail"));
    }

    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody MemberSignUpRequestDto requestDto) {

        ResponseDto<?> result = memberService.signUp(requestDto);

        return result;
    }

    @GetMapping("/signUpDuplicationChk")
    public boolean signUpDuplicationChk(HttpServletRequest request) {
        String userEmail = request.getParameter("userEmail");
        String userNickName = request.getParameter("userNickName");

        boolean result = false;

        if(userEmail != null) {
            System.out.println("이메일 확인 : " + userEmail);
            result = memberService.emailDuplicationChk(userEmail);
        } else {
            System.out.println("닉네임 확인 : " + userNickName);
            result = memberService.nickNameDuplicationChk(userNickName);
        }
        System.out.println("중복체크 : " + result);

        return result;
    }

    @PostMapping("/signIn")
    public ResponseDto<TokenDto> signIn(@RequestBody MemberSignInRequestDto requestDto) {

        ResponseDto<TokenDto> result = memberService.signIn(requestDto);

        return result;
    }

    @PostMapping("/memberInfo")
    public ResponseDto<MemberInfoResponseDto> findMemberInfo() {

        ResponseDto<MemberInfoResponseDto> result = memberService.memberInfo(SecurityUtil.getCurrentMemberId());

        return result;
    }
}
