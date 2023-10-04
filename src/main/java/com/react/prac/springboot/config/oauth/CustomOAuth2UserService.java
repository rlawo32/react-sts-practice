package com.react.prac.springboot.config.oauth;

import com.react.prac.springboot.config.oauth.dto.OAuth2Attributes;
import com.react.prac.springboot.config.oauth.dto.SessionUser;
import com.react.prac.springboot.jpa.domain.member.MemberRepository;
import com.react.prac.springboot.jpa.domain.member.Member;
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

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2UserService<OAuth2UserRequest, OAuth2User> service = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = service.loadUser(userRequest); // OAuth2 정보를 가져옴

        Map<String, Object> originAttributes = oAuth2User.getAttributes(); // OAuth2User의 attribute

        // OAuth2 서비스 ID(google, kakao, naver)
        String registrationId = userRequest.getClientRegistration().getRegistrationId(); // 소셜 정보를 가져옴

        SessionUser sessionUser = OAuth2Attributes.extract(registrationId, originAttributes);
        sessionUser.setProvider(registrationId);

        Member member = saveOrUpdate(sessionUser);

        // OAuth를 지원하는 소셜 서비스들간의 약속(google=sub, naver=id ...)
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName(); // 해당 소셜 서비스에서 유니크한 id값을 전달

        Map<String, Object> customAttribute = customAttribute(originAttributes, userNameAttributeName, sessionUser, member.getId(), registrationId);

        return new DefaultOAuth2User(
                Collections.singleton(
                        new SimpleGrantedAuthority(member.getRoleKey())),
                customAttribute,
                userNameAttributeName
        );
    }

    private Map customAttribute(Map attributes, String userNameAttributeName, SessionUser sessionUser, Long memberId, String registrationId) {
        Map<String, Object> customAttribute = new LinkedHashMap<>();
        customAttribute.put(userNameAttributeName, attributes.get(userNameAttributeName));
        customAttribute.put("memberId", memberId);
        customAttribute.put("memberEmail", sessionUser.getEmail());
        customAttribute.put("memberNickname", sessionUser.getName());
        customAttribute.put("memberAttributeCode", sessionUser.getAttributeCode());
        customAttribute.put("picture", sessionUser.getPicture());
        customAttribute.put("provider", registrationId);

        return customAttribute;
    }

    private Member saveOrUpdate(SessionUser sessionUser) {
        Member member = memberRepository.findByAttributeCode(sessionUser.getAttributeCode())
                .map(entity -> entity.infoUpdate(sessionUser.getName(), sessionUser.getProvider()))
                .orElse(sessionUser.toMemeber());

        return memberRepository.save(member);
    }
}
