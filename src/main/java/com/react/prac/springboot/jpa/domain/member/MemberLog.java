package com.react.prac.springboot.jpa.domain.member;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

@Getter
@NoArgsConstructor
@Table(name = "member_log")
@Entity
public class MemberLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(nullable = false)
    private String logLoginEmail; // 로그인 한 회원 email

    @Column(nullable = false)
    private String logLoginAttributeCode; // 로그인 한 회원 attributeCode

    @Column(name = "log_login_date", nullable = false)
    @CreatedDate
    private String createdDate; // 로그인 시도 일시

    @Column(nullable = false)
    private String logLoginSuccess; // 로그인 성공 여부

    @Column(nullable = false)
    private String logLoginReason; // 로그인 성공/실패 이유

    @Column(nullable = false)
    private String logLoginCategory; // 일반로그인/소셜로그인

    @Builder
    public MemberLog(Member member, String logLoginEmail, String logLoginAttributeCode, String createdDate, String logLoginSuccess, String logLoginReason, String logLoginCategory) {
        this.member = member;
        this.logLoginEmail = logLoginEmail;
        this.logLoginAttributeCode = logLoginAttributeCode;
        this.createdDate = createdDate;
        this.logLoginSuccess = logLoginSuccess;
        this.logLoginReason = logLoginReason;
        this.logLoginCategory = logLoginCategory;
    }

}
