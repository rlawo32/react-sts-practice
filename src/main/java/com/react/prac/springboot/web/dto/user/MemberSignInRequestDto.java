package com.react.prac.springboot.web.dto.user;

import lombok.*;

@Data
@NoArgsConstructor
public class MemberSignInRequestDto {

    private String memberEmail;
    private String memberPw;

    @Builder
    public MemberSignInRequestDto(String memberEmail, String memberPw) {
        this.memberEmail = memberEmail;
        this.memberPw = memberPw;
    }

}
