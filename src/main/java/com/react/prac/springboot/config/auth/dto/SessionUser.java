package com.react.prac.springboot.config.auth.dto;

import com.react.prac.springboot.jpa.domain.user.Role;
import com.react.prac.springboot.jpa.domain.user.Member;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionUser {
    private String name;
    private String email;
    private String provider;
    private String picture;

    public Member toMemeber() {
        return Member.builder()
                .role(Role.GUEST)
                .memberPw("")
                .memberNickname(name)
                .memberBirth("")
                .memberEmail(email)
                .provider(provider)
                .picture(picture)
                .build();
    }
}
