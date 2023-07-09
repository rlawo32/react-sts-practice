package com.react.prac.springboot.web.dto;

import com.react.prac.springboot.domain.user.Role;
import com.react.prac.springboot.domain.user.Users;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UsersSignUpDto {

//    private String userId;
    private String userEmail;
    private String userPw;
//    private String userName;
    private String userBirth;
//    private String userGender;
    private String userNickName;
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

    public Users toUsers() {
        return Users.builder()
                .role(Role.USER)
                .userEmail(userEmail)
                .userPw(userPw)
                .userNickName(userNickName)
                .userBirth(userBirth)
                .provider("")
                .picture("")
                .build();
    }

}
