package com.react.prac.springboot.config.security;

import com.react.prac.springboot.config.security.dto.TokenDto;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class TokenProvider implements InitializingBean {
    // JWT 생성 및 검증을 위한 키
    private static final String SECURITY_KEY = "security";
    private static final String AUTHORITIES_KEY = "auth";
    private static final String BEARER_TYPE = "Bearer";
    private final long tokenValidityInMilliseconds;
    private final String secret;
    private Key key;

    private final Logger logger = LoggerFactory.getLogger(TokenProvider.class);


    public TokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.token-validity-in-seconds}") long tokenValidityInSeconds) {
        this.secret = secret;
        this.tokenValidityInMilliseconds = tokenValidityInSeconds * 1000; // 86400ms : 1.44m(0.001d), 86400000ms : 1440m(1d)
    }


    // 빈이 생성되고 주입을 받은 후에 secret값을 Base64 Decode해서 key 변수에 할당하기 위해
    @Override
    public void afterPropertiesSet() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public TokenDto generateTokenDto(Authentication authentication) {
        // 권한들 가져오기
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        // 토큰의 expire 시간을 설정
        long now = (new Date()).getTime();
        Date exprTime = new Date(now + this.tokenValidityInMilliseconds);

        System.out.println("key 확인 1 : " + key.getEncoded());
        System.out.println("key 확인 2 : " + key.getAlgorithm());
        System.out.println("key 확인 3 : " + key.getFormat());
        System.out.println("key 확인 4 : " + key.toString());

        String accessToken = Jwts.builder()
                .setSubject(authentication.getName())       // payload "sub": "name"
                .claim(AUTHORITIES_KEY, authorities)        // payload "auth": "ROLE_USER"
                .signWith(key, SignatureAlgorithm.HS512)    // header "alg": "HS512"
                .setExpiration(exprTime)        // payload "exp": 1516239022 (예시)
                .compact();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS512)
                .setExpiration(exprTime)
                .compact();

        return TokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .accessTokenExpiresIn(exprTime)
                .build();
    }

    // JWT 생성 메서드
    public String createJwtToken(String userEmail) {
        // 만료기한 설정 (현재 시간 + 1시간으로 설정)
        // Date exprTime = Date.from(Instant.now().plus(1,  ChronoUnit.HOURS));

        // 토큰의 expire 시간을 설정
        long now = (new Date()).getTime();
        Date exprTime = new Date(now + this.tokenValidityInMilliseconds);

        // base64로 인코딩
        // SECURITY_KEY = Base64.getEncoder().encodeToString(SECURITY_KEY.getBytes());

        Claims claims = Jwts.claims().setSubject(userEmail);

        // JWT 생성
        return Jwts.builder()
                .setClaims(claims) // JWT 이름(sub) 설정
                .setIssuedAt(new Date()) // JWT 생성일
                .setExpiration(exprTime) // JWT 만료일
                .signWith(SignatureAlgorithm.HS512, SECURITY_KEY) // 암호화에 사용될 알고리즘, 키 설정
                .compact(); // JWT 생성 COMPACT
    }

    // JWT 검증 메서드
    public String validateJwtToken(String token) {
        // 매개변수로 받은 token을 키를 사용해서 복호화 (DECODING)
        Claims claims = Jwts.parser().setSigningKey(SECURITY_KEY).parseClaimsJws(token).getBody();

        // 복호화된 token의 payload에서 설정했던 이름(sub)을 가져옴
        return claims.getSubject();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts
                .parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get(AUTHORITIES_KEY).toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        User principal = new User(claims.getSubject(), "", authorities);

        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    // 토큰의 유효성 검증을 수행
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {

            logger.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {

            logger.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {

            logger.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {

            logger.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

}
