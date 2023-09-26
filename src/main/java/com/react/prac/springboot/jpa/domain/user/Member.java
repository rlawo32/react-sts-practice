package com.react.prac.springboot.jpa.domain.user;

import com.react.prac.springboot.jpa.domain.board.BaseTimeEntity;
import com.react.prac.springboot.jpa.domain.board.BoardRecommend;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

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
    private String memberSecessionYn;

    @OneToMany(mappedBy = "member", cascade = CascadeType.REMOVE)
    private List<MemberLog> memberLogs;

    @Column
    private String picture;

    @Column
    private String provider;

    @Builder
    public Member(Role role, String memberEmail, String memberPw, String memberNickname,
                  String memberSecessionYn, String memberBirth, String provider, String picture) {
        this.role = role;
        this.memberEmail = memberEmail;
        this.memberPw = memberPw;
        this.memberNickname = memberNickname;
        this.memberBirth = memberBirth;
        this.memberSecessionYn = memberSecessionYn;
        this.provider = provider;
        this.picture = picture;
    }

    public Member infoUpdate(String memberNickname, String memberBirth) {
        this.memberNickname = memberNickname;
        this.memberBirth = memberBirth;

        return this;
    }

    public Member passwordUpdate(String changePassword) {
        this.memberPw = changePassword;

        return this;
    }

    public Member memberSecession(String memberSecession) {
        this.memberSecessionYn = memberSecession;

        return this;
    }


    public String getRoleKey() {
        return this.role.getKey();
    }
}
