package com.react.prac.springboot.config.auth;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.DriverManager;

public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    String REDIRECT_URI = "http://localhost:3000/";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
         Object pne = authentication.getPrincipal();
         if(pne == null) {
             throw new NullPointerException("null cannot be cast to non-null type org.springframework.security.oauth2.core.user.OAuth2User");
         } else {
             OAuth2User oAuth2User = (OAuth2User)pne;
             DriverManager.println("SuccessHandler oAuth2User: " + oAuth2User);
             response.sendRedirect(UriComponentsBuilder.fromUriString(REDIRECT_URI)
                     .queryParam("accessToken", new Object[]{"accessToken"})
                     .queryParam("refreshToken", new Object[]{"refreshToken"})
                     .build().encode(StandardCharsets.UTF_8)
                     .toUriString());
         }
    }
}
