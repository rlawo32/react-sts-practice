package com.react.prac.springboot.web.dto.user;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import com.react.prac.springboot.jpa.domain.user.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
public class MemberInfoResponseDto {

    private Long memberId;
    private String memberEmail;
    private String memberBirth;
    private String memberNickname;
    private String createdDate;
    private String modifiedDate;

    public MemberInfoResponseDto(Member member) {
        this.memberId = member.getId();
        this.memberEmail = member.getMemberEmail();
        this.memberBirth = member.getMemberBirth();
        this.memberNickname = member.getMemberNickname();
        this.createdDate = member.getCreatedDate();
        this.modifiedDate = member.getModifiedDate();
    }
}
