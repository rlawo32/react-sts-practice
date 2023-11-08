package com.react.prac.springboot.web.dto.board;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BoardImageRequestDto {

    private String imgName;
    private String imgUrl;
    private Long imgSize;
}
