package com.react.prac.springboot.config.auth.dto;

import com.react.prac.springboot.domain.user.Role;
import com.react.prac.springboot.domain.user.Users;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionUser {
    private String name;
    private String email;
    private String provider;
    private String picture;

    public Users toUsers() {
        return Users.builder()
                .role(Role.GUEST)
                .userPw("")
                .userNickName(name)
                .userBirth("")
                .userEmail(email)
                .provider(provider)
                .picture(picture)
                .build();
    }
}
