package com.react.prac.springboot.web.dto.user;

import com.react.prac.springboot.jpa.domain.user.Role;
import com.react.prac.springboot.jpa.domain.user.Member;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Data
@NoArgsConstructor
public class MemberSignUpRequestDto {

//    private String userId;
    private String memberEmail;
    private String memberPw;
//    private String userName;
    private String memberBirth;
//    private String userGender;
    private String memberNickname;
//    private String userPhone;

//    @Builder
//    public UsersSignUpDto(String userId, String userPw, String userName, String userBirth,
//                          String userGender, String userEmail, String userPhone) {
//        this.userId = userId;
//        this.userPw = userPw;
//        this.userName = userName;
//        this.userBirth = userBirth;
//        this.userGender = userGender;
//        this.userEmail = userEmail;
//        this.userPhone = userPhone;
//    }gg

    public Member toMember() throws NoSuchAlgorithmException, UnsupportedEncodingException {
        String sha256 = "" ;

        // getInstance() 메소드의 매개변수에 SHA-256 알고리즘 이름으로 지정
        MessageDigest mdSHA256 = MessageDigest.getInstance("SHA-256");

        // 받아온 데이터(패스워드)를 암호화
        mdSHA256.update(memberPw.getBytes("UTF-8"));

        // 바이트 배열로 해쉬를 반환
        byte[] sha256Hash = mdSHA256.digest();

        // StringBuffer 객체는 계속해서 append를 해도 객체는 오직 하나만 생성된다. => 메모리 낭비 개선
        StringBuffer hexSHA256hash = new StringBuffer();

        // 256비트로 생성 => 32Byte => 1Byte(8bit) => 16진수 2자리로 변환 => 16진수 한 자리는 4bit
        for(byte b : sha256Hash) {
            String hexString = String.format("%02x", b);
            hexSHA256hash.append(hexString);
        }
        sha256 = hexSHA256hash.toString();

        return Member.builder()
                .role(Role.USER)
                .memberEmail(memberEmail)
                .memberPw(sha256)
                .memberNickname(memberNickname)
                .memberBirth(memberBirth)
                .provider("")
                .picture("")
                .build();
    }

}
