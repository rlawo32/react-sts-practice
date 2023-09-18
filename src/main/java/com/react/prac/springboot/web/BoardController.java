package com.react.prac.springboot.web;

import com.react.prac.springboot.config.auth.SecurityUtil;
import com.react.prac.springboot.service.posts.BoardService;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.board.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
public class BoardController {

    private final BoardService boardService;
    private final HttpSession httpSession;

    @GetMapping("/oauth/loginInfo")
    public String oauthLoginInfo(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        return attributes.toString();
    }

    @PostMapping("/boardSave")
    public Long boardSave(@RequestBody BoardSaveRequestDto requestDto) {

        return boardService.boardInsert(requestDto);
    }

    @PutMapping("/api/v1/posts/{id}")
    public Long update(@PathVariable Long id, @RequestBody BoardUpdateRequestDto requestDto) {
//        System.out.println(">>>" + title);
//        System.out.println(">>>" + content);
        return boardService.update(id, requestDto);
    }

    @PostMapping("/detailBoard/{boardId}")
    public BoardDetailResponseDto detailBoard(@PathVariable Long boardId) {

        return boardService.findByBoardId(boardId);
    }

    @DeleteMapping("/api/v1/posts/{id}")
    public void delete(@PathVariable Long id) {
        boardService.delete(id);
    }

    @GetMapping("/tableBoardList")
    public Map<String, Object> tableBoardList(HttpServletRequest request) {

        return boardService.findAllDesc(request);
    }

    // 추천 기능

    @GetMapping("/recommendCheck")
    public boolean recommendCheck(HttpServletRequest request) {

        return boardService.recommendCheck(request);
    }

    @PostMapping("/recommendExec")
    public ResponseDto<?> recommendExec(@RequestBody RecommendRequestDto requestDto) {

        return boardService.recommendExec(requestDto);
    }

    @DeleteMapping("/recommendCancel")
    public ResponseDto<?> recommendCancel(@RequestBody RecommendRequestDto requestDto) {

        return boardService.recommendCancel(requestDto);
    }

    // 조회 기능
    @PostMapping("/viewsUp")
    public ResponseDto<?> viewsUp(@RequestBody RecommendRequestDto requestDto) {

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
    public ResponseDto<?> commentSave(@RequestBody CommentRequestDto requestDto) {

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
