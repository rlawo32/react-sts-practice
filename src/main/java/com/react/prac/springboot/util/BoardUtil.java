package com.react.prac.springboot.util;

import com.react.prac.springboot.jpa.domain.board.BoardImage;
import com.react.prac.springboot.jpa.domain.board.BoardImageRepository;
import com.react.prac.springboot.jpa.domain.board.MainBoard;
import com.react.prac.springboot.jpa.domain.board.MainBoardRepository;
import com.react.prac.springboot.web.dto.board.BoardImageRequestDto;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
@Data
public class BoardUtil {

    private final BoardImageRepository boardImageRepository;
    private final MainBoardRepository mainBoardRepository;

    // totalRecord : DB에서 구해온 해당 게시글의 전체 리스트
    // recordPerPage : 한 페이지에 보여질 리스트 수
    // page : 사용자가 선택한 페이지
    // pagePerBlock : 하단에 보여질 한 블럭 페이징 갯수

    public Map<String, Integer> paging(int totalRecord, int recordPerPage, int page, int pagePerBlock) {

        int totalPage;     // totalRecord와 recordPerPage로 계산한다.

        int beginRecord;   // page와 recordPerPage로 계산한다.
        int endRecord;     // beginRecord와 recordPerPage와 totalPage로 계산한다.

        int beginPage;     // page와 pagePerBlock으로 계산한다.
        int endPage;       // beginPage와 pagePerBlock과 totalPage로 계산한다.

        // totalPage 필드 값 계산
        totalPage = totalRecord / recordPerPage;
        if(totalRecord % recordPerPage != 0) {
            totalPage++;
        }

        // beginRecord, endRecord 필드 값 계산
        beginRecord = (page - 1) * recordPerPage + 1;
        endRecord = beginRecord + recordPerPage - 1;
        if(endRecord > totalRecord) {
            endRecord = totalRecord;
        }

        // beginPage, endPage 필드 값 계산
        beginPage = (pagePerBlock * (page - 1) / pagePerBlock) + 1;
        endPage = beginPage + pagePerBlock - 1;
        if(endPage > totalPage) {
            endPage = totalPage;
        }

        Map<String, Integer> paging = new HashMap<>();
        paging.put("totalPage", totalPage);
        paging.put("beginRecord", beginRecord);
        paging.put("endRecord", endRecord);
        paging.put("beginPage", beginPage);
        paging.put("endPage", endPage);

        return paging;
    }

    public void boardImageInsert(Long boardId, List<BoardImageRequestDto> requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. boardId : " + boardId));

        for(int i=0; i<requestDto.size(); i++) {

            String boardImageName = requestDto.get(i).getImgName();
            String boardImageUrl = requestDto.get(i).getImgUrl();
            Long boardImageSize = requestDto.get(i).getImgSize();
            String originName = boardImageName.substring(boardImageName.lastIndexOf("_")+1);
            String customName = boardImageName.substring(boardImageName.lastIndexOf("/")+1);
            String urlName = boardImageUrl;
            String extension = boardImageName.substring(boardImageName.lastIndexOf(".")+1);

            BoardImage boardImage = BoardImage.builder()
                    .mainBoard(mainBoard)
                    .boardImageOriginName(originName)
                    .boardImageCustomName(customName)
                    .boardImageUrlName(urlName)
                    .boardImageSize(boardImageSize)
                    .boardImageExtension(extension)
                    .build();

            boardImageRepository.save(boardImage);
        }
    }
}