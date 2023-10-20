package com.react.prac.springboot.jpa.domain.board;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Builder
    public BoardImage(MainBoard mainBoard, String boardImageOriginName, String boardImageCustomName,
                      String boardImageUrlName, Long boardImageSize, String boardImageExtension) {
        this.mainBoard = mainBoard;
        this.boardImageOriginName = boardImageOriginName;
        this.boardImageCustomName = boardImageCustomName;
        this.boardImageUrlName = boardImageUrlName;
        this.boardImageSize = boardImageSize;
        this.boardImageExtension = boardImageExtension;
    }

}
