package com.react.prac.springboot.jpa.domain.user;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Getter
@NoArgsConstructor
@Table(name = "member_image")
@Entity
public class MemberImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_image_id", nullable = false)
    private Long id;

    @JoinColumn(name = "member_id")
    @ManyToOne(fetch = FetchType.LAZY)
    private Member member;

    private String caption;
    private String post_image_url;    //사진을 전달받아서 서버의 특정 폴더에 저장할 것이므로 사진이 저장된 경로를 저장

    @Column(name = "image_upload_date")
    private String createDate;

    @PrePersist
    public void createDate() {
        createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
    }

    @Builder
    public MemberImage(Member member, String caption, String post_image_url, String createDate) {
        this.member = member;
        this.caption = caption;
        this.post_image_url = post_image_url;
        this.createDate = createDate;
    }
}
