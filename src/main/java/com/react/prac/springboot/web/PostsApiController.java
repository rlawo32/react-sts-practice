package com.react.prac.springboot.web;

import com.react.prac.springboot.config.auth.dto.SessionUser;
import com.react.prac.springboot.service.posts.BoardService;
import com.react.prac.springboot.web.dto.board.MainBoardListResponseDto;
import com.react.prac.springboot.web.dto.board.BoardResponseDto;
import com.react.prac.springboot.web.dto.board.BoardSaveRequestDto;
import com.react.prac.springboot.web.dto.board.BoardUpdateRequestDto;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class PostsApiController {

    private final BoardService boardService;
    private final HttpSession httpSession;

    @GetMapping("/oauth/loginInfo")
    public String oauthLoginInfo(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        return attributes.toString();
    }

    @PostMapping("/api/v1/posts")
    public Long save(@RequestBody BoardSaveRequestDto requestDto) {
        System.out.println("값 확인1");
        return boardService.save(requestDto);
    }

    @PutMapping("/api/v1/posts/{id}")
    public Long update(@PathVariable Long id, @RequestBody BoardUpdateRequestDto requestDto) {
//        System.out.println(">>>" + title);
//        System.out.println(">>>" + content);
        return boardService.update(id, requestDto);
    }

    @GetMapping("/api/v1/posts/{id}")
    public BoardResponseDto findById (@PathVariable Long id) {
        return boardService.findById(id);
    }

    @DeleteMapping("/api/v1/posts/{id}")
    public void delete(@PathVariable Long id) {
        boardService.delete(id);
    }

    @GetMapping("/postsList")
    public Map<String, Object> postsList() {
        Map<String, Object> result = new HashMap<>();
        List<MainBoardListResponseDto> posts = boardService.findAllDesc();
        SessionUser user = (SessionUser) httpSession.getAttribute("user");
        System.out.println("세션유저 : " + user);
        result.put("postsList", posts);
        //result.put("userName", user.getName());
        return result;
    }
}
