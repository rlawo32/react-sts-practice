package com.react.prac.springboot.web.dto;

import com.react.prac.springboot.domain.user.Users;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersSignInResponseDto {

//    private String userPw;
//    private String userNickName;
//    private String userBirth;
//    private String userEmail;
//
//    @Builder
//    public UsersSignInResponseDto(Users entity) {
//        this.userEmail = entity.getEmail();
//        this.userPw = entity.getUserPw();
//        this.userNickName = entity.getUserNickName();
//        this.userBirth = entity.getUserBirth();
//    }

    private String token;
    private int exprTime;
    private Users users;

}
