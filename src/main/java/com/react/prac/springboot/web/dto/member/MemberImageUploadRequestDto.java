package com.react.prac.springboot.web.dto.member;

import com.react.prac.springboot.jpa.domain.member.Member;
import com.react.prac.springboot.jpa.domain.member.MemberImage;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MemberImageUploadRequestDto {

    private MultipartFile multipartFile;
    private String caption;

    public MemberImage toEntity(Member member, String memberImageName) {
        return MemberImage.builder()
                .member(member)
                .caption(caption)
                .memberImageName(memberImageName)
                .build();
    }
}
