package com.react.prac.springboot.config.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class TokenProvider {
    // JWT 생성 및 검증을 위한 키
    private static final String SECURITY_KEY = "jwtseckey!@";

    // JWT 생성 메서드
    public String createJwtToken (String userEmail) {
        // 만료기한 설정 (현재 시간 + 1시간으로 설정)
        Date exprTime = Date.from(Instant.now().plus(1,  ChronoUnit.HOURS));

        // JWT 생성
        return Jwts.builder()
                .signWith(SignatureAlgorithm.HS512, SECURITY_KEY) // 암호화에 사용될 알고리즘, 키 설정
                .setSubject(userEmail) // JWT 이름(sub) 설정
                .setIssuedAt(new Date()) // JWT 생성일
                .setExpiration(exprTime) // JWT 만료일
                .compact(); // JWT 생성 COMPACT
    }

    // JWT 검증 메서드
    public String validateJwtToken (String token) {
        // 매개변수로 받은 token을 키를 사용해서 복호화 (DECODING)
        Claims claims = Jwts.parser().setSigningKey(SECURITY_KEY).parseClaimsJws(token).getBody();

        // 복호화된 token의 payload에서 설정했던 이름(sub)을 가져옴
        return claims.getSubject();
    }
}
