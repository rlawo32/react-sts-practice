package com.react.prac.springboot.jpa.domain.board;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static jakarta.persistence.FetchType.LAZY;

@Data
@NoArgsConstructor // LOMBOK Annotation
@Entity // JPA Annotation
@Table(name = "BoardImage")
public class BoardImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_image_id")
    private Long id; // board image pk

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "board_id")
    private MainBoard mainBoard; // 게시글 id

    @Column(nullable = false)
    private String boardImageOriginName; // board image originName

    @Column(nullable = false)
    private String boardImageCustomName; // board image customName

    @Column(nullable = false)
    private String boardImageUrlName; // board image urlName

    @Column(nullable = false)
    private Long boardImageSize; // board image size

    @Column(nullable = false)
    private String boardImageExtension; // board image extension

    @Column(name = "image_upload_date", nullable = false)
    private String createDate;

    @PrePersist
    public void createDate() {
        createDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
    }

    @Builder
    public BoardImage(MainBoard mainBoard, String boardImageOriginName, String boardImageCustomName,
                      String boardImageUrlName, Long boardImageSize, String boardImageExtension, String createDate) {
        this.mainBoard = mainBoard;
        this.boardImageOriginName = boardImageOriginName;
        this.boardImageCustomName = boardImageCustomName;
        this.boardImageUrlName = boardImageUrlName;
        this.boardImageSize = boardImageSize;
        this.boardImageExtension = boardImageExtension;
        this.createDate = createDate;
    }

}
