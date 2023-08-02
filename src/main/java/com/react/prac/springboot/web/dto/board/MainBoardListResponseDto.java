package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MainBoardListResponseDto {

    private Long id;
    private String title;
    private String author;
    private String content;
    private LocalDateTime modifiedDate;

    public MainBoardListResponseDto(MainBoard entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.author = entity.getAuthor();
        this.content = entity.getContent();
        this.modifiedDate = entity.getModifiedDate();
    }
}
