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
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class TokenProvider implements InitializingBean {
    // JWT 생성 및 검증을 위한 키
    private static final String SECURITY_KEY = "security";
    private static final String AUTHORITIES_KEY = "auth";
    private static final String BEARER_TYPE = "Bearer";
    private final long accessTokenValidityInMilliseconds;
    private final long refreshTokenValidityInMilliseconds;
    private final String secret;
    private Key key;

    private final Logger logger = LoggerFactory.getLogger(TokenProvider.class);


    public TokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.token-validity-in-seconds}") long tokenValidityInSeconds) {
        this.secret = secret;
        this.accessTokenValidityInMilliseconds = tokenValidityInSeconds * 1000; // 86400ms : 1.44m(0.001d), 86400000ms : 1440m(1d)
        this.refreshTokenValidityInMilliseconds = tokenValidityInSeconds * 10000; // 86400ms : 1.44m(0.001d), 864000000ms : 14400m(10d)
    }


    // 빈이 생성되고 주입을 받은 후에 secret값을 Base64 Decode해서 key 변수에 할당하기 위해
    @Override
    public void afterPropertiesSet() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public TokenDto generateTokenDto(Authentication authentication, String loginType) {

        // 권한들 가져오기
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        // 만료기한 설정 (현재 시간 + 1시간으로 설정)
        // Date exprTime = Date.from(Instant.now().plus(1,  ChronoUnit.HOURS));

        // 토큰의 expire 시간을 설정
        long now = (new Date()).getTime();
        Date accessExprTime = new Date(now + this.accessTokenValidityInMilliseconds);
        Date refreshExprTime = new Date(now + this.refreshTokenValidityInMilliseconds);

        System.out.println("key 확인 1 : " + key.getEncoded());
        System.out.println("key 확인 2 : " + key.getAlgorithm());
        System.out.println("key 확인 3 : " + key.getFormat());
        System.out.println("key 확인 4 : " + key.toString());

        String accessToken = "";
        String refreshToken = "";

        if(loginType.equals("SOCIAL")) {

            DefaultOAuth2User defaultOAuth2User = (DefaultOAuth2User) authentication.getPrincipal();
            Object memberId = defaultOAuth2User.getAttributes().get("memberId");
            Object provider = defaultOAuth2User.getAttributes().get("provider");

            accessToken = Jwts.builder()
                    .setSubject(String.valueOf(memberId))       // payload "sub": "name"
                    .claim(AUTHORITIES_KEY, authorities)        // payload "auth": "ROLE_SOCIAL"
                    .claim("provider", String.valueOf(provider))
                    .signWith(key, SignatureAlgorithm.HS512)    // header "alg": "HS512"
                    .setExpiration(accessExprTime)              // payload "exp": 1516239022 (예시)
                    .compact();

            // Refresh Token 생성
            refreshToken = Jwts.builder()
                    .setSubject(String.valueOf(memberId))
                    .claim(AUTHORITIES_KEY, authorities)
                    .claim("provider", String.valueOf(provider))
                    .signWith(key, SignatureAlgorithm.HS512)
                    .setExpiration(refreshExprTime)
                    .compact();
        } else if(loginType.equals("COMMON")) {
            accessToken = Jwts.builder()
                    .setSubject(authentication.getName())       // payload "sub": "name"
                    .claim(AUTHORITIES_KEY, authorities)        // payload "auth": "ROLE_USER"
                    .signWith(key, SignatureAlgorithm.HS512)    // header "alg": "HS512"
                    .setExpiration(accessExprTime)              // payload "exp": 1516239022 (예시)
                    .compact();

            // Refresh Token 생성
            refreshToken = Jwts.builder()
                    .setSubject(authentication.getName())
                    .claim(AUTHORITIES_KEY, authorities)
                    .signWith(key, SignatureAlgorithm.HS512)
                    .setExpiration(refreshExprTime)
                    .compact();
        } else {
            accessToken = Jwts.builder()
                    .setSubject(authentication.getName())       // payload "sub": "name"
                    .claim(AUTHORITIES_KEY, authorities)        // payload "auth": "ROLE_SOCIAL"
                    .claim("provider", loginType)
                    .signWith(key, SignatureAlgorithm.HS512)    // header "alg": "HS512"
                    .setExpiration(accessExprTime)              // payload "exp": 1516239022 (예시)
                    .compact();

            // Refresh Token 생성
            refreshToken = Jwts.builder()
                    .setSubject(authentication.getName())
                    .claim(AUTHORITIES_KEY, authorities)
                    .claim("provider", loginType)
                    .signWith(key, SignatureAlgorithm.HS512)
                    .setExpiration(refreshExprTime)
                    .compact();
        }

        return TokenDto.builder()
                .grantType(BEARER_TYPE)
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .refreshTokenExpiresIn(refreshExprTime)
                .build();
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
