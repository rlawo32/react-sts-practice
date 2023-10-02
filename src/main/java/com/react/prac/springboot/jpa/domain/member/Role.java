package com.react.prac.springboot.jpa.domain.member;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {

    GUEST("ROLE_GUEST", "손님"),
    USER("ROLE_USER", "일반 사용자"),
    SOCIAL("ROLE_SOCIAL", "소셜 사용자"),
    ADMIN("ADMIN", "관리자");

    private final String key;
    private final String title;

}
