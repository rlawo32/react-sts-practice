package com.react.prac.springboot.config.auth;

import com.react.prac.springboot.config.security.TokenProvider;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.jpa.domain.user.RefreshToken;
import com.react.prac.springboot.jpa.domain.user.RefreshTokenRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.DriverManager;

@RequiredArgsConstructor
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    String REDIRECT_URI = "http://localhost:3000/";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

         DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
         Object memberId = defaultOAuth2User.getAttributes().get("memberId");

         if(defaultOAuth2User == null) {
             throw new NullPointerException("null cannot be cast to non-null type org.springframework.security.oauth2.core.user.OAuth2User");
         } else {
             try {
                 TokenDto tokenDto = tokenProvider.generateTokenDto(authentication);

                 // 4. RefreshToken 저장
                 RefreshToken refreshToken = RefreshToken.builder()
                         .key((String) memberId)
                         .value(tokenDto.getRefreshToken())
                         .build();

                 refreshTokenRepository.save(refreshToken);

                 DriverManager.println("SuccessHandler oAuth2User: " + defaultOAuth2User);
                 response.sendRedirect(UriComponentsBuilder.fromUriString(REDIRECT_URI)
                         .queryParam("accessToken", tokenDto.getAccessToken())
                         .queryParam("refreshToken", tokenDto.getRefreshToken())
                         .build().encode(StandardCharsets.UTF_8)
                         .toUriString());

             } catch (Exception e) {
                 e.printStackTrace();
             }

         }
    }
}
