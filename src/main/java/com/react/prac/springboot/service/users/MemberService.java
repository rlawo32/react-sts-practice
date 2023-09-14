package com.react.prac.springboot.service.users;

import com.react.prac.springboot.config.security.TokenProvider;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.config.security.dto.TokenRequestDto;
import com.react.prac.springboot.jpa.domain.user.MemberRepository;
import com.react.prac.springboot.jpa.domain.user.Member;
import com.react.prac.springboot.jpa.domain.user.RefreshToken;
import com.react.prac.springboot.jpa.domain.user.RefreshTokenRepository;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.user.MemberInfoResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInRequestDto;
import com.react.prac.springboot.web.dto.user.MemberSignUpRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Ref;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ResponseDto<?> signUp(MemberSignUpRequestDto requestDto) {
        String memberEmail = requestDto.getMemberEmail();

        try {
            if(memberRepository.existsByMemberEmail(memberEmail)) {
                return ResponseDto.setFailed("Existed Email!");
            } else {
                memberRepository.save(requestDto.toMember(passwordEncoder));
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Sign Up Success", null);
    }

    @Transactional
    public boolean emailDuplicationChk(String memberEmail) {

        return memberRepository.existsByMemberEmail(memberEmail);
    }

    @Transactional
    public boolean nickNameDuplicationChk(String memberNickname) {

        return memberRepository.existsByMemberNickname(memberNickname);
    }

    @Transactional
    public ResponseDto<TokenDto> signIn(MemberSignInRequestDto requestDto) {

        TokenDto tokenDto = new TokenDto();

        try {
            boolean existsLogin = memberRepository.existsByMemberEmail(requestDto.getMemberEmail());

            if(!existsLogin) {
                return ResponseDto.setFailed("Sign In Information Does Not Match");
            } else {
                // 1. Login ID/PW 를 기반으로 AuthenticationToken 생성
                UsernamePasswordAuthenticationToken authenticationToken = requestDto.toAuthentication();

                System.out.println("authenticationToken 확인 : " + authenticationToken);

                // 2. 실제로 검증 (사용자 비밀번호 체크) 이 이루어지는 부분
                //    authenticate 메서드가 실행이 될 때 CustomUserDetailsService 에서 만들었던 loadUserByUsername 메서드가 실행됨
                Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

                System.out.println("authentication 확인 : " + authenticationToken);

                // 3. 인증 정보를 기반으로 JWT 토큰 생성
                tokenDto = tokenProvider.generateTokenDto(authentication);

                // 4. RefreshToken 저장
                RefreshToken refreshToken = RefreshToken.builder()
                        .key(authentication.getName())
                        .value(tokenDto.getRefreshToken())
                        .build();

                refreshTokenRepository.save(refreshToken);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Sign In Success", tokenDto);
    }

    @Transactional
    public ResponseDto<TokenDto> reissue(TokenRequestDto requestDto) {

        TokenDto tokenDto = new TokenDto();

        try {
            // 1. Refresh Token 검증
            if (!tokenProvider.validateToken(requestDto.getRefreshToken())) {
                return ResponseDto.setFailed("Refresh Token 이 유효하지 않습니다.");
            } else {
                // 2. Access Token 에서 Member ID 가져오기
                Authentication authentication = tokenProvider.getAuthentication(requestDto.getRefreshToken());

                // 3. 저장소에서 Member ID 를 기반으로 Refresh Token 값 가져옴
                RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("로그아웃 된 사용자입니다."));

                // 4. Refresh Token 일치하는지 검사
                if (!refreshToken.getValue().equals(requestDto.getRefreshToken())) {
                    return ResponseDto.setFailed("토큰의 유저 정보가 일치하지 않습니다.");
                } else {
                    // 5. 새로운 토큰 생성
                    tokenDto = tokenProvider.generateTokenDto(authentication);

                    // 6. 저장소 정보 업데이트
                    RefreshToken newRefreshToken = refreshToken.updateValue(tokenDto.getRefreshToken());
                    refreshTokenRepository.save(newRefreshToken);
                }
            }

        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        // 토큰 발급
        return ResponseDto.setSuccess("Reissue Success", tokenDto);
    }

    @Transactional
    public ResponseDto<MemberInfoResponseDto> memberInfo(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

        MemberInfoResponseDto memberInfoResponseDto = new MemberInfoResponseDto(member);

        System.out.println(memberInfoResponseDto.getMemberId());

        return ResponseDto.setSuccess("memberInfo Success", memberInfoResponseDto);
    }
}
