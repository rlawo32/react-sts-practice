package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.BoardImage;
import lombok.Data;

@Data
public class BoardImageResponseDto {

    private Long boardImageId;
    private Long boardId;
    private String boardImageOriginName;
    private String boardImageCustomName;
    private String boardImageUrlName;
    private Long boardImageSize;
    private String boardImageExtension;

    public BoardImageResponseDto(BoardImage boardImage) {
        this.boardImageId = boardImage.getId();
        this.boardId = boardImage.getMainBoard().getId();
        this.boardImageOriginName = boardImage.getBoardImageOriginName();
        this.boardImageCustomName = boardImage.getBoardImageCustomName();
        this.boardImageUrlName = boardImage.getBoardImageUrlName();
        this.boardImageSize = boardImage.getBoardImageSize();
        this.boardImageExtension = boardImage.getBoardImageExtension();
    }
}
