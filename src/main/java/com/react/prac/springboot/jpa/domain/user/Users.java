package com.react.prac.springboot.jpa.domain.user;

import com.react.prac.springboot.jpa.domain.board.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "Users")
public class Users extends BaseTimeEntity {

    @Id
    @Column(nullable = false)
    private String email;
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private String userPw;

    @Column(nullable = false)
    private String userNickName;

    @Column(nullable = false)
    private String userBirth;

    @Column(nullable = false)
    private String provider;

    @Column
    private String picture;

    @Builder
    public Users(Role role, String userEmail, String userPw, String userNickName,
                 String userBirth, String provider, String picture) {
        this.role = role;
        this.email = userEmail;
        this.userPw = userPw;
        this.userNickName = userNickName;
        this.userBirth = userBirth;
        this.provider = provider;
        this.picture = picture;
    }

    public Users update(String name, String picture) {
        this.userNickName = name;
        this.picture = picture;

        return this;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }
}
