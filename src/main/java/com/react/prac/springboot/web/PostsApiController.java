package com.react.prac.springboot.web;

import com.react.prac.springboot.config.auth.dto.SessionUser;
import com.react.prac.springboot.service.posts.PostsService;
import com.react.prac.springboot.web.dto.*;
import jakarta.servlet.http.HttpServletRequest;
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

    private final PostsService postsService;
    private final HttpSession httpSession;

    @PostMapping("/axiosTest")
    public String SignUpFunc (HttpServletRequest request, @RequestBody AxiosDto dto) {

        // testID 출력
        System.out.println(dto.getUserId());

        // 1234 출력
        System.out.println(dto.getUserPw());
        // 회원가입 같은 기능의 경우 Insert시키는 Service단 호출하면 됩니다.

        return "통신 성공";
    }

    @GetMapping("/oauth/loginInfo")
    public String oauthLoginInfo(Authentication authentication) {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        return attributes.toString();
    }

    @PostMapping("/api/v1/posts")
    public Long save(@RequestBody PostsSaveRequestDto requestDto) {
        System.out.println("값 확인1");
        System.out.println(">>>" + requestDto.getTitle());
        System.out.println(">>>" + requestDto.getAuthor());
        System.out.println(">>>" + requestDto.getContent());
        return postsService.save(requestDto);
    }

    @PutMapping("/api/v1/posts/{id}")
    public Long update(@PathVariable Long id, @RequestBody PostsUpdateRequestDto requestDto) {
//        System.out.println(">>>" + title);
//        System.out.println(">>>" + content);
        return postsService.update(id, requestDto);
    }

    @GetMapping("/api/v1/posts/{id}")
    public PostsResponseDto findById (@PathVariable Long id) {
        return postsService.findById(id);
    }

    @DeleteMapping("/api/v1/posts/{id}")
    public void delete(@PathVariable Long id) {
        postsService.delete(id);
    }



    @GetMapping("/postsList")
    public Map<String, Object> postsList() {
        Map<String, Object> result = new HashMap<>();
        List<PostsListResponseDto> posts = postsService.findAllDesc();
        SessionUser user = (SessionUser) httpSession.getAttribute("user");
        System.out.println("세션유저 : " + user);
        result.put("postsList", posts);
        //result.put("userName", user.getName());
        return result;
    }
}
