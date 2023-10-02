package com.react.prac.springboot.config.oauth.dto;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;

public enum OAuth2Attributes {
    GOOGLE("google", (attributes) -> {
        SessionUser sessionUser = new SessionUser();

        sessionUser.setEmail((String) attributes.get("email"));
        sessionUser.setAttributeCode((String) attributes.get("sub"));
        sessionUser.setName((String) attributes.get("name"));
        sessionUser.setPicture("");

        return sessionUser;
    }),

    NAVER("naver", (attributes) -> {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        SessionUser sessionUser = new SessionUser();

        sessionUser.setEmail("");
        sessionUser.setAttributeCode((String) response.get("id"));
        sessionUser.setName((String) response.get("nickname"));
        sessionUser.setPicture("");

        return sessionUser;
    }),

    KAKAO("kakao", (attributes) -> {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> kakaoProfile = (Map<String, Object>) kakaoAccount.get("profile");
        SessionUser sessionUser = new SessionUser();

        sessionUser.setEmail("");
        sessionUser.setAttributeCode(String.valueOf(attributes.get("id")));
        sessionUser.setName((String) kakaoProfile.get("nickname"));
        sessionUser.setPicture("");

        return sessionUser;
    });

    private final String registrationId;
    private final Function<Map<String, Object>, SessionUser> of;

    OAuth2Attributes(String registrationId, Function<Map<String, Object>, SessionUser> of) {
        this.registrationId = registrationId;
        this.of = of;
    }

    public static SessionUser extract(String registrationId, Map<String, Object> attributes) {
        return Arrays.stream(values())
                .filter(provider -> registrationId.equals(provider.registrationId))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new)
                .of.apply(attributes);
    }
}
