package com.react.prac.springboot.jpa.domain.member;

import com.react.prac.springboot.jpa.domain.board.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Table(name = "member_withdraw")
@Entity
public class MemberWithdraw extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_withdraw_id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private Long withdrawMemberId;

    @Column(nullable = false)
    private String withdrawMemberEmail;

    @Column(nullable = false)
    private String withdrawMemberNickname;

    @Builder
    public MemberWithdraw(Long memberId, String memberEmail, String memberNickname) {
        this.withdrawMemberId = memberId;
        this.withdrawMemberEmail = memberEmail;
        this.withdrawMemberNickname = memberNickname;
    }
}
