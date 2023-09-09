package com.react.prac.springboot.service.users;

import com.react.prac.springboot.config.security.TokenProvider;
import com.react.prac.springboot.jpa.domain.user.MemberRepository;
import com.react.prac.springboot.jpa.domain.user.Member;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInRequestDto;
import com.react.prac.springboot.web.dto.user.MemberSignUpRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final TokenProvider tokenProvider;

    public ResponseDto<?> signUp(MemberSignUpRequestDto requestDto) {
        String memberEmail = requestDto.getMemberEmail();

        try {
            if(memberRepository.existsByMemberEmail(memberEmail)) {
                return ResponseDto.setFailed("Existed Email!");
            } else {
                memberRepository.save(requestDto.toMember());
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Sign Up Success", null);
    }

    public boolean emailDuplicationChk(String memberEmail) {

        return memberRepository.existsByMemberEmail(memberEmail);
    }

    public boolean nickNameDuplicationChk(String memberNickname) {

        return memberRepository.existsByMemberNickname(memberNickname);
    }

    public ResponseDto<MemberSignInResponseDto> signIn(MemberSignInRequestDto requestDto) {

        MemberSignInResponseDto memberSignInResponseDto = new MemberSignInResponseDto();

        try {
            // getInstance() 메소드의 매개변수에 SHA-256 알고리즘 이름으로 지정
            MessageDigest mdSHA256 = MessageDigest.getInstance("SHA-256");

            // 받아온 데이터(패스워드)를 암호화 후 바이트 배열로 해쉬를 반환
            byte[] sha256Hash = mdSHA256.digest(requestDto.getMemberPw().getBytes("UTF-8"));

            // StringBuffer 객체는 계속해서 append를 해도 객체는 오직 하나만 생성된다. => 메모리 낭비 개선
            StringBuffer hexSHA256hash = new StringBuffer();

            // 256비트로 생성 => 32Byte => 1Byte(8bit) => 16진수 2자리로 변환 => 16진수 한 자리는 4bit
            for(byte b : sha256Hash) {
                String hexString = String.format("%02x", b);
                hexSHA256hash.append(hexString);
            }

            String memberEmail = requestDto.getMemberEmail();
            String memberPw = hexSHA256hash.toString();

            boolean existsLogin = memberRepository.existsByMemberEmailAndMemberPw(memberEmail, memberPw);

            if(!existsLogin) {
                return ResponseDto.setFailed("Sign In Information Does Not Match");
            } else {
                Member member = memberRepository.findByMemberEmail(memberEmail).get();

                String token = tokenProvider.createJwtToken(memberEmail);
                int exprTime = 3600000;

                memberSignInResponseDto.setToken(token);
                memberSignInResponseDto.setExprTime(exprTime);
                memberSignInResponseDto.setMember(member);
            }

        } catch (NoSuchAlgorithmException n) {
            n.printStackTrace();
            return ResponseDto.setFailed("SHA-256 Error!");
        } catch (UnsupportedEncodingException u) {
            u.printStackTrace();
            return ResponseDto.setFailed("Byte : getBytes Error!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Sign In Success", memberSignInResponseDto);
    }
}
