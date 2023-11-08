package com.react.prac.springboot.web.dto.member;

import com.react.prac.springboot.jpa.domain.member.Role;
import com.react.prac.springboot.jpa.domain.member.Member;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

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

    public Member toMember(PasswordEncoder passwordEncoder) {

        return Member.builder()
                .role(Role.USER)
                .memberEmail(memberEmail)
                .memberPw(passwordEncoder.encode(memberPw))
                .memberNickname(memberNickname)
                .memberBirth(memberBirth)
                .memberSecessionYn("N")
                .provider("")
                .attributeCode("")
                .picture("")
                .build();
    }

//    public Member toMember() throws NoSuchAlgorithmException, UnsupportedEncodingException {
//        String sha256 = "" ;
//
//        // getInstance() 메소드의 매개변수에 SHA-256 알고리즘 이름으로 지정
//        MessageDigest mdSHA256 = MessageDigest.getInstance("SHA-256");
//
//        // 받아온 데이터(패스워드)를 암호화
//        mdSHA256.update(memberPw.getBytes("UTF-8"));
//
//        // 바이트 배열로 해쉬를 반환
//        byte[] sha256Hash = mdSHA256.digest();
//
//        // StringBuffer 객체는 계속해서 append를 해도 객체는 오직 하나만 생성된다. => 메모리 낭비 개선
//        StringBuffer hexSHA256hash = new StringBuffer();
//
//        // 256비트로 생성 => 32Byte => 1Byte(8bit) => 16진수 2자리로 변환 => 16진수 한 자리는 4bit
//        for(byte b : sha256Hash) {
//            String hexString = String.format("%02x", b);
//            hexSHA256hash.append(hexString);
//        }
//        sha256 = hexSHA256hash.toString();
//
//        return Member.builder()
//                .role(Role.USER)
//                .memberEmail(memberEmail)
//                .memberPw(sha256)
//                .memberNickname(memberNickname)
//                .memberBirth(memberBirth)
//                .provider("")
//                .picture("")
//                .build();
//    }

}
