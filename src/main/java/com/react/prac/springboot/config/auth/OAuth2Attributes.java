package com.react.prac.springboot.config.auth;

import com.react.prac.springboot.config.auth.dto.SessionUser;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;

public enum OAuth2Attributes {
    GOOGLE("google", (attributes) -> {
        SessionUser sessionUser = new SessionUser();
        sessionUser.setName((String) attributes.get("name"));
        sessionUser.setEmail((String) attributes.get("email"));
        sessionUser.setPicture((String) attributes.get("picture"));
        return sessionUser;
    }),

    NAVER("naver", (attributes) -> {
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");
        System.out.println(response);
        SessionUser sessionUser = new SessionUser();
        sessionUser.setName((String) response.get("name"));
        sessionUser.setEmail(((String) response.get("email")));
        return sessionUser;
    }),

    KAKAO("kakao", (attributes) -> {
        // kakao는 kakao_account에 유저정보가 있다. (email)
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        // kakao_account안에 또 profile이라는 JSON객체가 있다. (nickname, profile_image)
        Map<String, Object> kakaoProfile = (Map<String, Object>)kakaoAccount.get("profile");

        SessionUser sessionUser = new SessionUser();
        sessionUser.setName((String) kakaoProfile.get("nickname"));
        sessionUser.setEmail((String) kakaoAccount.get("email"));
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
