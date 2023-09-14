package com.react.prac.springboot.web;

import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.config.security.dto.TokenRequestDto;
import com.react.prac.springboot.service.users.MemberService;
import com.react.prac.springboot.util.EmailUtil;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInRequestDto;
import com.react.prac.springboot.web.dto.user.MemberSignUpRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// @CrossOrigin(originPatterns = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
@RequestMapping("/auth")
public class AuthController {

    public static final String AUTHORIZATION_HEADER = "Authorization";
    private final MemberService memberService;

    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody MemberSignUpRequestDto requestDto) {

        ResponseDto<?> result = memberService.signUp(requestDto);

        System.out.println(result);

        return result;
    }

    @PostMapping("/signIn")
    public ResponseDto<TokenDto> signIn(@RequestBody MemberSignInRequestDto requestDto) {

        ResponseDto<TokenDto> result = memberService.signIn(requestDto);

        return result;
    }

    @PostMapping("/reissue")
    public ResponseDto<TokenDto> reissue(@RequestBody TokenRequestDto requestDto, HttpServletRequest request) {
        requestDto.setAccessToken(request.getHeader(AUTHORIZATION_HEADER));

        System.out.println(requestDto.getRefreshToken());

        ResponseDto<TokenDto> result = memberService.reissue(requestDto);

        return result;
    }
}
