package com.react.prac.springboot.web;

import com.react.prac.springboot.config.auth.dto.SessionUser;
import com.react.prac.springboot.service.posts.BoardService;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.board.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class BoardController {

    private final BoardService boardService;
    private final HttpSession httpSession;

    @GetMapping("/oauth/loginInfo")
    public String oauthLoginInfo(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        return attributes.toString();
    }

    @PostMapping("/boardInsert")
    public Long save(@RequestBody BoardSaveRequestDto requestDto) {
        System.out.println("값 확인1");
        return boardService.boardInsert(requestDto);
    }

    @PutMapping("/api/v1/posts/{id}")
    public Long update(@PathVariable Long id, @RequestBody BoardUpdateRequestDto requestDto) {
//        System.out.println(">>>" + title);
//        System.out.println(">>>" + content);
        return boardService.update(id, requestDto);
    }

    @GetMapping("/detailBoard/{boardId}")
    public BoardResponseDto findByBoardId (@PathVariable Long boardId) {
        return boardService.findByBoardId(boardId);
    }

    @DeleteMapping("/api/v1/posts/{id}")
    public void delete(@PathVariable Long id) {
        boardService.delete(id);
    }

    @GetMapping("/game1BoardList")
    public Map<String, Object> game1BoardList(HttpServletRequest request) {

        return boardService.findAllDesc(request);
    }

    // 추천 기능

    @GetMapping("/recommendCheck")
    public boolean recommendCheck(HttpServletRequest request) {
        Long boardId = Long.valueOf(request.getParameter("boardId"));
        Long memberId = Long.valueOf(request.getParameter("memberId"));

        return boardService.recommendCheck(boardId, memberId);
    }

    @PostMapping("/recommendUp")
    public ResponseDto<?> recommendUp(@RequestBody RecommendRequestDto requestDto) {

        return boardService.recommendUp(requestDto);
    }

    @DeleteMapping("/recommendDown")
    public ResponseDto<?> recommendDown(@RequestBody RecommendRequestDto requestDto) {

        return boardService.recommendDown(requestDto);
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
}
