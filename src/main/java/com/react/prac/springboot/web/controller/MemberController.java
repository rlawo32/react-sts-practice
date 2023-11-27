package com.react.prac.springboot.web.controller;

import com.react.prac.springboot.config.security.SecurityUtil;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.service.members.MemberService;
import com.react.prac.springboot.util.MemberUtil;
import com.react.prac.springboot.web.dto.*;
import com.react.prac.springboot.web.dto.member.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/sendAuthCode")
    public Map<String, Object> sendAuthCode(HttpServletRequest request) {

        return MemberUtil.sendAuthCode(request.getParameter("memberEmail"));
    }

    @PostMapping("/signUp")
    public CommonResponseDto<?> signUp(@RequestBody MemberSignUpRequestDto requestDto) {

        CommonResponseDto<?> result = memberService.signUp(requestDto);

        return result;
    }

    @GetMapping("/signUpDuplicationChk")
    public boolean signUpDuplicationChk(HttpServletRequest request) {
        String memberEmail = request.getParameter("memberEmail");
        String memberNickname = request.getParameter("memberNickname");

        boolean result = false;

        if(memberEmail != null && memberNickname == null) {
            System.out.println("이메일 중복 체크 !!");
            result = memberService.emailDuplicationChk(memberEmail);
        } else if(memberEmail == null && memberNickname != null) {
            System.out.println("닉네임 중복 체크 !!");
            result = memberService.nicknameDuplicationChk(memberNickname);
        } else {
            System.out.println("이메일/닉네임 중복 체크 !!");
            result = memberService.emailAndNicknameDuplicationChk(memberEmail, memberNickname);
        }

        return result;
    }

    @GetMapping("/passwordDuplicationChk")
    public boolean passwordDuplicationChk(HttpServletRequest request) {

        return memberService.passwordDuplicationChk(request.getParameter("passwordCheck"));
    }

    @PostMapping("/signIn")
    public CommonResponseDto<TokenDto> signIn(@RequestBody MemberSignInRequestDto requestDto) {

        CommonResponseDto<TokenDto> result = memberService.signIn(requestDto);

        return result;
    }

    @PostMapping("/memberInfo")
    public CommonResponseDto<MemberInfoResponseDto> findMemberInfo() {

        CommonResponseDto<MemberInfoResponseDto> result = memberService.memberInfo(SecurityUtil.getCurrentMemberId());

        return result;
    }

    @PutMapping("/memberUpdate")
    public Long memberUpdate(HttpServletRequest request) {

        return memberService.memberUpdate(request);
    }

    @PutMapping("/passwordUpdate")
    public CommonResponseDto<?> passwordUpdate(HttpServletRequest request) {

        CommonResponseDto<?> result = memberService.passwordUpdate(request);

        return result;
    }

    @PutMapping("/memberSecession")
    public CommonResponseDto<?> passwordUpdate(@RequestBody MemberSignInRequestDto requestDto) {

        CommonResponseDto<?> result = memberService.memberSecession(requestDto);

        return result;
    }

    @PostMapping("/imageUpload")
    public CommonResponseDto<?> imageUpload(MultipartFile multipartFile) {

        CommonResponseDto<?> result = memberService.memberImageUploadS3(multipartFile);

        return result;
    }

    @GetMapping("/imageLoad")
    public String imageLoad(HttpServletRequest request) {

        return memberService.memberImageLoad(request.getParameter("imageFileName"));
    }

    @DeleteMapping("/imageDelete")
    public CommonResponseDto<?> imageDelete() {

        CommonResponseDto<?> result = memberService.memberImageDelete();

        return result;
    }

    @GetMapping("/memberLog")
    public Map<String, Object> findMemberLog(HttpServletRequest request) {

        return memberService.memberLog(request);
    }

    @GetMapping("/memberRole")
    public String findMemberRole() {

        return memberService.memberRole();
    }
}
