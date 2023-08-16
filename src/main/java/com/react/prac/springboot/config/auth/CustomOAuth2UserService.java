package com.react.prac.springboot.config.auth;

import com.react.prac.springboot.config.auth.dto.OAuth2Attributes;
import com.react.prac.springboot.config.auth.dto.SessionUser;
import com.react.prac.springboot.jpa.domain.user.MemberRepository;
import com.react.prac.springboot.jpa.domain.user.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        Map<String, Object> attributes = oAuth2User.getAttributes();
        SessionUser sessionUser = OAuth2Attributes.extract(registrationId, attributes);
        sessionUser.setProvider(registrationId);

        Member user = saveOrUpdate(sessionUser);

        Map<String, Object> customAttribute = customAttribute(attributes, userNameAttributeName, sessionUser, registrationId);

        return new DefaultOAuth2User(
                Collections.singleton(
                        new SimpleGrantedAuthority(user.getRoleKey())),
                customAttribute,
                userNameAttributeName
        );
    }

    private Map customAttribute(Map attributes, String userNameAttributeName, SessionUser sessionUser, String registrationId) {
        Map<String, Object> customAttribute = new LinkedHashMap<>();
        customAttribute.put(userNameAttributeName, attributes.get(userNameAttributeName));
        customAttribute.put("provider", registrationId);
        customAttribute.put("userName", sessionUser.getName());
        customAttribute.put("userEmail", sessionUser.getEmail());
        customAttribute.put("picture", sessionUser.getPicture());
        return customAttribute;

    }

    private Member saveOrUpdate(SessionUser sessionUser) {
        Member user = userRepository.findByMemberEmailAndProvider(sessionUser.getEmail(), sessionUser.getProvider())
                .map(entity -> entity.update(sessionUser.getName(), sessionUser.getPicture()))
                .orElse(sessionUser.toMemeber());

        return userRepository.save(user);
    }
}
