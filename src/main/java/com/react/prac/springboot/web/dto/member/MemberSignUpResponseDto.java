package com.react.prac.springboot.web.dto.member;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberSignUpResponseDto {
    private String token;
    private int exprTime;
}
