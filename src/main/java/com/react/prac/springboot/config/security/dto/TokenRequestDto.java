package com.react.prac.springboot.config.security.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TokenRequestDto {

    private String accessToken;
    private String refreshToken;
}