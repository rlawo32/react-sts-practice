package com.react.prac.springboot.web.dto.member;

import lombok.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberSignInRequestDto {

    private String memberEmail;
    private String memberPw;

    public UsernamePasswordAuthenticationToken toAuthentication() {
        return new UsernamePasswordAuthenticationToken(memberEmail, memberPw);
    }
}
