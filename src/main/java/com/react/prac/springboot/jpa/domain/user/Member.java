package com.react.prac.springboot.jpa.domain.user;

import com.react.prac.springboot.jpa.domain.board.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "Member")
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "member_role", nullable = false)
    private Role role;

    @Column(name = "member_email", nullable = false)
    private String memberEmail;

    @Column(name = "member_password", nullable = false)
    private String memberPw;

    @Column(name = "member_nickname", nullable = false)
    private String memberNickname;

    @Column(name = "member_birth", nullable = false)
    private String memberBirth;

    @Column(nullable = false)
    private String provider;

    @Column
    private String picture;

    @Builder
    public Member(Role role, String memberEmail, String memberPw, String memberNickname,
                  String memberBirth, String provider, String picture) {
        this.role = role;
        this.memberEmail = memberEmail;
        this.memberPw = memberPw;
        this.memberNickname = memberNickname;
        this.memberBirth = memberBirth;
        this.provider = provider;
        this.picture = picture;
    }

    public Member update(String name, String picture) {
        this.memberNickname = name;
        this.picture = picture;

        return this;
    }

    public String getRoleKey() {
        return this.role.getKey();
    }
}
