package com.react.prac.springboot.web.controller;

import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.config.security.dto.TokenRequestDto;
import com.react.prac.springboot.service.members.MemberService;
import com.react.prac.springboot.web.dto.CommonResponseDto;
import com.react.prac.springboot.web.dto.member.MemberSignInRequestDto;
import com.react.prac.springboot.web.dto.member.MemberSignUpRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    private final MemberService memberService;


    @GetMapping("/axiosHeaderReissue")
    public void axiosHeaderReissue() {

        System.out.println("새로고침 오류 보완 !!");

    }

    @PostMapping("/signUp")
    public CommonResponseDto<?> signUp(@RequestBody MemberSignUpRequestDto requestDto) {

        CommonResponseDto<?> result = memberService.signUp(requestDto);

        System.out.println(result);

        return result;
    }

    @PostMapping("/signIn")
    public CommonResponseDto<TokenDto> signIn(@RequestBody MemberSignInRequestDto requestDto) {

        CommonResponseDto<TokenDto> result = memberService.signIn(requestDto);

        return result;
    }

    @PostMapping("/reissue")
    public CommonResponseDto<TokenDto> reissue(@RequestBody TokenRequestDto requestDto, HttpServletRequest request) {
        requestDto.setAccessToken(request.getHeader(AUTHORIZATION_HEADER));

        System.out.println(requestDto.getRefreshToken());

        CommonResponseDto<TokenDto> result = memberService.reissue(requestDto);

        return result;
    }

    @GetMapping("/oauth2/{socialLoginType}")
    public CommonResponseDto<?> googleLogin(@PathVariable("socialLoginType") String oauthType) {

        System.out.println(oauthType);

        CommonResponseDto<?> result = CommonResponseDto.setSuccess("Test !!", null);

        return result;
    }
}
