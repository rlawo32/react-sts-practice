package com.react.prac.springboot.config.oauth.dto;

import com.react.prac.springboot.jpa.domain.member.Role;
import com.react.prac.springboot.jpa.domain.member.Member;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionUser {

    private String email;
    private String attributeCode;
    private String name;
    private String picture;
    private String provider;

    public Member toMemeber() {
        return Member.builder()
                .role(Role.SOCIAL)
                .memberEmail("")
                .memberPw("")
                .memberNickname(name)
                .memberBirth("")
                .memberSecessionYn("N")
                .picture(picture)
                .attributeCode(attributeCode)
                .provider(provider)
                .build();
    }
}
