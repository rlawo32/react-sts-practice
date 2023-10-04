package com.react.prac.springboot.web.dto.member;

import com.react.prac.springboot.jpa.domain.member.Member;
import lombok.Data;

@Data
public class MemberInfoResponseDto {

    private Long memberId;
    private String memberEmail;
    private String memberBirth;
    private String memberNickname;
    private String createdDate;
    private String modifiedDate;
    private String recentLogDate;
    private String picture;
    private String attributeCode;
    private String provider;

    public MemberInfoResponseDto(Member member) {
        this.memberId = member.getId();
        this.memberEmail = member.getMemberEmail();
        this.memberBirth = member.getMemberBirth();
        this.memberNickname = member.getMemberNickname();
        this.createdDate = member.getCreatedDate();
        this.modifiedDate = member.getModifiedDate();
        this.picture = member.getPicture();
        this.attributeCode = member.getAttributeCode();
        this.provider = member.getProvider();
    }
}
