package com.react.prac.springboot.service.users;

import com.react.prac.springboot.config.security.TokenProvider;
import com.react.prac.springboot.jpa.domain.user.MemberRepository;
import com.react.prac.springboot.jpa.domain.user.Member;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInResponseDto;
import com.react.prac.springboot.web.dto.user.MemberSignInDto;
import com.react.prac.springboot.web.dto.user.MemberSignUpDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;
    private final TokenProvider tokenProvider;

    public ResponseDto<?> signUp(MemberSignUpDto requestDto) {
        String memberEmail = requestDto.getMemberEmail();

        // 아이디(이메일) 중복 확인
//        boolean existsEmail = userRepository.existsByEmail(userEmail);

        try {
//            if(existsEmail) {
//                return ResponseDto.setFailed("Existed Email!");
//            }

            if(memberRepository.existsByMemberEmail(memberEmail)) {
                return ResponseDto.setFailed("Existed Email!");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error! (email)");
        }

        System.out.println("회원가입 확인" + requestDto.toMember());

        // 회원가입 확인
        try {
            memberRepository.save(requestDto.toMember());
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error! (users )");
        }

        return ResponseDto.setSuccess("Sign Up Success", null);
    }

    public boolean emailDuplicationChk(String memberEmail) {
        return memberRepository.existsByMemberEmail(memberEmail);
    }

    public boolean nickNameDuplicationChk(String memberNickname) {
        return memberRepository.existsByMemberNickname(memberNickname);
    }

    public ResponseDto<MemberSignInResponseDto> signIn(MemberSignInDto requestDto) {
        String memberEmail = requestDto.getMemberEmail();
        String memberPw = requestDto.getMemberPw();

//        Users findUser = userRepository.findByIdPw(userId, userPw)
//                .orElseThrow(() -> new IllegalArgumentException("아이디와 비밀번호가 일치하지 않습니다."));

//        System.out.println("로그인 서비스 확인 : " + findUser);

        try {
            // boolean existsLogin1 = userRepository.findByIdPw(userEmail, userPw);
            boolean existsLogin2 = memberRepository.existsByMemberEmailAndMemberPw(memberEmail, memberPw);
//            if(!existsLogin1) {
//                return ResponseDto.setFailed("Sign In Information Does Not Match");
//            }
            if(!existsLogin2) {
                return ResponseDto.setFailed("Sign In Information Does Not Match");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Database Error!");
        }

        Member member = null;
        try {
            member = memberRepository.findByMemberEmail(requestDto.getMemberEmail()).get();
        } catch (Exception e) {
            return ResponseDto.setFailed("Database Error!");
        }

        member.setMemberPw("");

        String token = tokenProvider.createJwtToken(memberEmail);
        int exprTime = 3600000;

        MemberSignInResponseDto usersSignInResponseDto = new MemberSignInResponseDto(token, exprTime, member);

        return ResponseDto.setSuccess("Sign In Success", usersSignInResponseDto);
    }
}
