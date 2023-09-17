package com.react.prac.springboot.web.dto.user;

import com.react.prac.springboot.jpa.domain.user.Member;
import com.react.prac.springboot.jpa.domain.user.MemberImage;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class MemberImageUploadRequestDto {

    private MultipartFile multipartFile;
    private String caption;

    public MemberImage toEntity(Member member, String post_image_url) {
        return MemberImage.builder()
                .member(member)
                .caption(caption)
                .post_image_url(post_image_url)
                .build();
    }
}
