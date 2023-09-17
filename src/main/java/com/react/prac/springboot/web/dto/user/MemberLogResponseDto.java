package com.react.prac.springboot.web.dto.user;

import com.react.prac.springboot.jpa.domain.user.Member;
import com.react.prac.springboot.jpa.domain.user.MemberLog;
import lombok.Getter;

@Getter
public class MemberLogResponseDto {

    private Long logId;
    private Long logMemberId;
    private String logMemberEmail;
    private String logLoginDate;
    private String logLoginSuccess;
    private String logLoginReason;
    private int loginLogNo;

    public MemberLogResponseDto(MemberLog memberLog) {
        this.logId = memberLog.getId();
        this.logMemberId = memberLog.getLogMemberId();
        this.logMemberEmail = memberLog.getLogMemberEmail();
        this.logLoginDate = memberLog.getCreatedDate();
        this.logLoginSuccess = memberLog.getLogLoginSuccess();
        this.logLoginReason = memberLog.getLogLoginReason();
    }
}
