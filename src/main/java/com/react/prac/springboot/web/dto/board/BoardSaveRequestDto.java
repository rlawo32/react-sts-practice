package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoardSaveRequestDto {

    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private String boardAuthor;

    @Builder
    public BoardSaveRequestDto(String boardTab, String boardTitle, String boardContent, String boardAuthor) {
        this.boardTab = boardTab;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
        this.boardAuthor = boardAuthor;
    }

    public MainBoard toEntity() {
        return MainBoard.builder()
                .boardTab(boardTab)
                .boardTitle(boardTitle)
                .boardContent(boardContent)
                .boardAuthor("rlawo32")
                .build();
    }
}
