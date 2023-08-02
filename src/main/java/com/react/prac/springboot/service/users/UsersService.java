package com.react.prac.springboot.service.users;

import com.react.prac.springboot.config.security.TokenProvider;
import com.react.prac.springboot.jpa.domain.user.UserRepository;
import com.react.prac.springboot.jpa.domain.user.Users;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.user.UsersSignInResponseDto;
import com.react.prac.springboot.web.dto.user.UsersSignInDto;
import com.react.prac.springboot.web.dto.user.UsersSignUpDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UsersService {

    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    public ResponseDto<?> signUp(UsersSignUpDto requestDto) {
        String userEmail = requestDto.getUserEmail();

        // 아이디(이메일) 중복 확인
//        boolean existsEmail = userRepository.existsByEmail(userEmail);

        try {
//            if(existsEmail) {
//                return ResponseDto.setFailed("Existed Email!");
//            }

            if(userRepository.existsById(userEmail)) {
                return ResponseDto.setFailed("Existed Email!");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error! (email)");
        }

        System.out.println("회원가입 확인" + requestDto.toUsers());

        // 회원가입 확인
        try {
            userRepository.save(requestDto.toUsers());
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error! (users )");
        }

        return ResponseDto.setSuccess("Sign Up Success", null);
    }

    public boolean emailDuplicationChk(String userEmail) {
        return userRepository.existsByEmail(userEmail);
    }

    public boolean nickNameDuplicationChk(String userNickName) {
        return userRepository.existsByUserNickName(userNickName);
    }

    public ResponseDto<UsersSignInResponseDto> signIn(UsersSignInDto requestDto) {
        String userEmail = requestDto.getUserEmail();
        String userPw = requestDto.getUserPw();

//        Users findUser = userRepository.findByIdPw(userId, userPw)
//                .orElseThrow(() -> new IllegalArgumentException("아이디와 비밀번호가 일치하지 않습니다."));

//        System.out.println("로그인 서비스 확인 : " + findUser);

        try {
            // boolean existsLogin1 = userRepository.findByIdPw(userEmail, userPw);
            boolean existsLogin2 = userRepository.existsByEmailAndUserPw(userEmail, userPw);
//            if(!existsLogin1) {
//                return ResponseDto.setFailed("Sign In Information Does Not Match");
//            }
            if(!existsLogin2) {
                return ResponseDto.setFailed("Sign In Information Does Not Match");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Database Error!");
        }

        Users users = null;
        try {
            users = userRepository.findById(requestDto.getUserEmail()).get();
        } catch (Exception e) {
            return ResponseDto.setFailed("Database Error!");
        }

        users.setUserPw("");

        String token = tokenProvider.createJwtToken(userEmail);
        int exprTime = 3600000;

        UsersSignInResponseDto usersSignInResponseDto = new UsersSignInResponseDto(token, exprTime, users);

        return ResponseDto.setSuccess("Sign In Success", usersSignInResponseDto);
    }
}
