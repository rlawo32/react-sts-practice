package com.react.prac.springboot.web.dto.board;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class BoardUpdateRequestDto {

    private String boardCategory;
    private String boardTab;
    private String boardTitle;
    private String boardContent;
    private List<BoardImageRequestDto> boardImage;
    private List<String> deleteImage;
    private List<String> selectDeleteImage;

    @Builder
    public BoardUpdateRequestDto(String boardCategory, String boardTab, String boardTitle, String boardContent) {
        this.boardCategory = boardCategory;
        this.boardTab = boardTab;
        this.boardTitle = boardTitle;
        this.boardContent = boardContent;
    }
}
