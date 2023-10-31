package com.react.prac.springboot.jpa.domain.member;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member; // 회원 id

    @Column(nullable = false)
    private String memberImageOriginName; // member image originName

    @Column(nullable = false)
    private String memberImageCustomName; // member image customName

    @Column(nullable = false)
    private String memberImageUrlName; // member image urlName

    @Column(nullable = false)
    private Long memberImageSize; // member image size

    @Column(nullable = false)
    private String memberImageExtension; // member image extension

    @Column(name = "image_upload_date", nullable = false)
    private String createDate;

    @PrePersist
    public void createDate() {
        createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
    }

    @Builder
    public MemberImage(Member member, String memberImageOriginName, String memberImageCustomName,
                       String memberImageUrlName, Long memberImageSize, String memberImageExtension, String createDate) {
        this.member = member;
        this.memberImageOriginName = memberImageOriginName;
        this.memberImageCustomName = memberImageCustomName;
        this.memberImageUrlName = memberImageUrlName;
        this.memberImageSize = memberImageSize;
        this.memberImageExtension = memberImageExtension;
        this.createDate = createDate;
    }
}
