package com.react.prac.springboot.domain.user;

import com.react.prac.springboot.domain.posts.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
@Table(name = "Users")
public class Users extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String userPw;

    @Column(nullable = false)
    private String userName;

    @Column(nullable = false)
    private String userBirth;

    @Column(nullable = false)
    private String userGender;

    @Column(nullable = false)
    private String email;

    @Column
    private String userPhone;

    @Column(nullable = false)
    private String provider;

    @Column
    private String picture;

    @Builder
    public Users(Long id, Role role, String userId, String userPw, String userName, String userBirth,
                 String userGender, String userEmail, String userPhone, String provider, String picture) {
        this.id = id;
        this.role = role;
        this.userId = userId;
        this.userPw = userPw;
        this.userName = userName;
        this.userBirth = userBirth;
        this.userGender = userGender;
        this.email = userEmail;
        this.userPhone = userPhone;
        this.provider = provider;
        this.picture = picture;
    }

    public Users update(String name, String picture) {
        this.userName = name;
        this.picture = picture;

        return this;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }
}
