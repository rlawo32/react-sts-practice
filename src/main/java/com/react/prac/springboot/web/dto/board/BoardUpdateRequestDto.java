package com.react.prac.springboot.web.dto.board;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BoardUpdateRequestDto {

    private String boardCategory;
    private String boardTab;
    private String boardTitle;
    private String boardContent;

    @Builder
    public BoardUpdateRequestDto(String boardCategory, String boardTab, String boardTitle, String boardContent) {
        this.boardCategory = boardCategory;
        this.boardTab = boardTab;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
    }
}
