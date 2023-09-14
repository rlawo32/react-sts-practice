package com.react.prac.springboot.config.auth;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    private SecurityUtil() { }

    // SecurityContext 에 유저 정보가 저장되는 시점
    // Request 가 들어올 때 JwtFilter 의 doFilter 에서 저장
    public static Long getCurrentMemberId() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        try {
            if (authentication == null || authentication.getName() == null || authentication.getName() == "anonymousUser") {
                return null;
            }
        } catch (RuntimeException e) {
            throw new RuntimeException("Security Context 에 인증 정보가 없습니다.");
        }


        return Long.parseLong(authentication.getName());
    }
}
