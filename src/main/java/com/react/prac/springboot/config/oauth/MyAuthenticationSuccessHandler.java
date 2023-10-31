package com.react.prac.springboot.config.oauth;

import com.react.prac.springboot.config.security.TokenProvider;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.jpa.domain.member.*;
import com.react.prac.springboot.util.ChatUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.sql.DriverManager;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RequiredArgsConstructor
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;
    private final MemberRepository memberRepository;
    private final MemberLogRepository memberLogRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

         DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
         Object memberId = defaultOAuth2User.getAttributes().get("memberId");
         Object memberAttributeCode = defaultOAuth2User.getAttributes().get("memberAttributeCode");

         if(defaultOAuth2User == null) {
             throw new NullPointerException("null cannot be cast to non-null type org.springframework.security.oauth2.core.user.OAuth2User");
         } else {
             try {
                 if(authentication.isAuthenticated()) {

                     Member member = memberRepository.findById((Long) memberId)
                             .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

                     MemberLog memberLog = MemberLog.builder()
                             .member(member)
                             .logLoginEmail("")
                             .logLoginAttributeCode(String.valueOf(memberAttributeCode))
                             .logLoginIpAddress("")
                             .logLoginSuccess("S")
                             .logLoginReason("OAuth 인증 성공")
                             .logLoginCategory("SOCIAL")
                             .createdDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm")))
                             .build();

                     memberLogRepository.save(memberLog);
                 }

                 TokenDto tokenDto = tokenProvider.generateTokenDto(authentication, "SOCIAL");

                 // 4. RefreshToken 저장
                 RefreshToken refreshToken = RefreshToken.builder()
                         .key(String.valueOf(memberId))
                         .value(tokenDto.getRefreshToken())
                         .build();

                 refreshTokenRepository.save(refreshToken);

                 DriverManager.println("SuccessHandler oAuth2User: " + defaultOAuth2User);
                 response.sendRedirect(UriComponentsBuilder.fromUriString(ChatUtil.redirectUrl)
                         .queryParam("bearer", tokenDto.getGrantType())
                         .queryParam("accessToken", tokenDto.getAccessToken())
                         .queryParam("refreshToken", tokenDto.getRefreshToken())
                         .queryParam("expires", tokenDto.getRefreshTokenExpiresIn())
                         .build().encode(StandardCharsets.UTF_8)
                         .toUriString());

             } catch (Exception e) {
                 e.printStackTrace();
             }

         }
    }
}
