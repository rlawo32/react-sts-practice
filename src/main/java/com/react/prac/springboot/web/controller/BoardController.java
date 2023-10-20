package com.react.prac.springboot.web.controller;

import com.react.prac.springboot.service.boards.BoardService;
import com.react.prac.springboot.web.dto.CommonResponseDto;
import com.react.prac.springboot.web.dto.board.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;

    @GetMapping("/tableBoardList")
    public Map<String, Object> tableBoardList(HttpServletRequest request) {

        return boardService.findAllDesc(request);
    }

    @PostMapping("/detailBoard/{boardId}")
    public BoardDetailResponseDto detailBoard(@PathVariable Long boardId) {

        return boardService.findByDetailBoard(boardId);
    }

    @PostMapping("/boardSave")
    public CommonResponseDto<?> boardSave(@RequestBody BoardSaveRequestDto requestDto) {

        CommonResponseDto<?> result = boardService.boardInsert(requestDto);

        return result;
    }

    @PostMapping("/boardImageSave")
    public CommonResponseDto<?> boardImageSave(@RequestPart("files") MultipartFile files) {

        CommonResponseDto<?> result = boardService.boardImageInsertS3(files);

        return result;
    }

    @DeleteMapping("/boardImageDelete")
    public CommonResponseDto<?> boardImageDelete(HttpServletRequest request) {

        CommonResponseDto<?> result = boardService.boardImageDeleteS3(request);

        return result;
    }

    @PutMapping("/boardUpdate/{boardId}")
    public Long boardUpdate(@PathVariable Long boardId, @RequestBody BoardUpdateRequestDto requestDto) {

        return boardService.boardUpdate(boardId, requestDto);
    }

    @PutMapping("/boardImageUpdate/{boardId}")
    public Long boardImageUpdate(@PathVariable Long boardId, @RequestPart("files") List<MultipartFile> files) {

        return null;
    }

    @DeleteMapping("/boardDelete/{boardId}")
    public void boardDelete(@PathVariable Long boardId) {

        boardService.boardDelete(boardId);
    }

    @DeleteMapping("/commentDelete/{commentId}")
    public void commentDelete(@PathVariable Long commentId) {

        boardService.commentDelete(commentId);
    }


    // 추천 기능
    @GetMapping("/recommendCheck")
    public boolean recommendCheck(HttpServletRequest request) {

        return boardService.recommendCheck(request);
    }

    @PostMapping("/recommendExec")
    public CommonResponseDto<?> recommendExec(@RequestBody RecommendRequestDto requestDto) {

        return boardService.recommendExec(requestDto);
    }

    @DeleteMapping("/recommendCancel")
    public CommonResponseDto<?> recommendCancel(@RequestBody RecommendRequestDto requestDto) {

        return boardService.recommendCancel(requestDto);
    }

    // 조회 기능
    @PostMapping("/viewsUp")
    public CommonResponseDto<?> viewsUp(@RequestBody RecommendRequestDto requestDto) {

        return boardService.viewsUp(requestDto);
    }

    // 이전글 , 다음글
    @GetMapping("/boardPrevAndNext")
    public Long findBoardPrevAndNext(HttpServletRequest request) {
        Long boardId = Long.valueOf(request.getParameter("boardId"));
        String orderId = request.getParameter("orderId");

        return boardService.findBoardPrevAndNext(boardId, orderId);
    }

    @GetMapping("/boardPrevAndNextSelect")
    public Map<String, Object> boardPrevAndNextSelect(HttpServletRequest request) {
        Long boardId = Long.valueOf(request.getParameter("boardId"));

        Map<String, Object> result = boardService.boardPrevAndNextSelect(boardId);

        return result;
    }

    // 댓글 기능
    @PostMapping("/commentSave")
    public CommonResponseDto<?> commentSave(@RequestBody CommentRequestDto requestDto) {

        return boardService.commentSave(requestDto);
    }

    @GetMapping("/commentList")
    public Map<String, Object> commentList(HttpServletRequest request) {

        return boardService.commentList(request);
    }

    @GetMapping("/recommendList")
    public Map<String, Object> recommendList(HttpServletRequest request) {

        return boardService.recommendList(request);
    }

}
