package com.react.prac.springboot.web.dto.board;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BoardSaveRequestDto {

    private String boardCategory;
    // C1: 리그오브레전드, C2: 오버워치, C3: 배틀그라운드,
    // C4: 메이플스토리, C5: 마인크래프트, C6: 스팀,
    private String boardTab;
    // T1: 전체, T2: 화제, T3: 정보, T4: 오류,
    // T5: 사진/동영상, T6: 팁과 노하우,
    private String boardTitle;
    private String boardContent;
    private Long boardAuthorId;
    private String boardAuthor;

    public MainBoard toEntity() {
        return MainBoard.builder()
                .boardCategory(boardCategory)
                .boardTab(boardTab)
                .boardTitle(boardTitle)
                .boardContent(boardContent)
                .boardAuthorId(boardAuthorId)
                .boardAuthor(boardAuthor)
                .build();
    }
}
