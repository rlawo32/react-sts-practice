package com.react.prac.springboot.web.dto.user;

import com.react.prac.springboot.jpa.domain.user.Role;
import com.react.prac.springboot.jpa.domain.user.Member;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MemberSignUpDto {

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

    public Member toMember() {
        return Member.builder()
                .role(Role.USER)
                .memberEmail(memberEmail)
                .memberPw(memberPw)
                .memberNickname(memberNickname)
                .memberBirth(memberBirth)
                .provider("")
                .picture("")
                .build();
    }

}
