package com.react.prac.springboot.web.dto.member;

import com.react.prac.springboot.jpa.domain.member.MemberLog;
import lombok.Getter;

@Getter
public class MemberLogResponseDto {

    private Long logId;
    private Long logMemberId;
    private String logLoginEmail;
    private String logLoginAttributeCode;
    private String logLoginIpAddress;
    private String logLoginDate;
    private String logLoginSuccess;
    private String logLoginReason;
    private String logLoginCategory;
    private int loginLogNo;

    public MemberLogResponseDto(MemberLog memberLog) {
        this.logId = memberLog.getId();
        this.logMemberId = memberLog.getMember().getId();
        this.logLoginEmail = memberLog.getLogLoginEmail();
        this.logLoginIpAddress = memberLog.getLogLoginIpAddress();
        this.logLoginAttributeCode = memberLog.getLogLoginAttributeCode();
        this.logLoginDate = memberLog.getCreatedDate();
        this.logLoginSuccess = memberLog.getLogLoginSuccess();
        this.logLoginReason = memberLog.getLogLoginReason();
        this.logLoginCategory = memberLog.getLogLoginCategory();
    }
}
