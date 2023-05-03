package com.react.prac.springboot.config.auth.dto;

import com.react.prac.springboot.domain.user.Role;
import com.react.prac.springboot.domain.user.Users;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SessionUser {
    private String name;
    private String email;
    private String provider;
    private String picture;

//    public SessionUser(Users user) {
//        this.name = user.getName();
//        this.email = user.getEmail();
//        this.provider = user.getProvider();
//        this.picture = user.getPicture();
//    }

    public Users toUsers() {
        return Users.builder()
                .name(name)
                .email(email)
                .provider(provider)
                .picture(picture)
                .role(Role.GUEST)
                .build();
    }
}
