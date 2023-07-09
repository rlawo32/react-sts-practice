package com.react.prac.springboot.web.dto;

import lombok.*;

@Data
@NoArgsConstructor
public class UsersSignInDto {

    private String userEmail;
    private String userPw;

    @Builder
    public UsersSignInDto(String userEmail, String userPw) {
        this.userEmail = userEmail;
        this.userPw = userPw;
    }

}
