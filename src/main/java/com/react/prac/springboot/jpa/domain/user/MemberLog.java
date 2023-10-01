package com.react.prac.springboot.jpa.domain.user;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
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
    private String logMemberEmail; // 로그인 한 회원 email

    @Column(name = "log_login_date", nullable = false)
    @CreatedDate
    private String createdDate; // 로그인 시도 일시

    @Column(nullable = false)
    private String logLoginSuccess; // 로그인 성공 여부

    @Column(nullable = false)
    private String logLoginReason; // 로그인 성공/실패 이유

    @Builder
    public MemberLog(Member member, String logMemberEmail, String createdDate, String logLoginSuccess, String logLoginReason) {
        this.member = member;
        this.logMemberEmail = logMemberEmail;
        this.createdDate = createdDate;
        this.logLoginSuccess = logLoginSuccess;
        this.logLoginReason = logLoginReason;
    }

}
