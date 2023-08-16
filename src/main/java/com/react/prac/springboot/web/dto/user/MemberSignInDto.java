package com.react.prac.springboot.web.dto.user;

import lombok.*;

@Data
@NoArgsConstructor
public class MemberSignInDto {

    private String memberEmail;
    private String memberPw;

    @Builder
    public MemberSignInDto(String memberEmail, String memberPw) {
        this.memberEmail = memberEmail;
        this.memberPw = memberPw;
    }

}
