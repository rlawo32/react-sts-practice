package com.react.prac.springboot.web;

import com.react.prac.springboot.config.auth.dto.SessionUser;
import com.react.prac.springboot.service.posts.PostsService;
import com.react.prac.springboot.web.dto.PostsListResponseDto;
import com.react.prac.springboot.web.dto.PostsResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class IndexController {

    private final PostsService postsService;
    private final HttpSession httpSession;

    @GetMapping("/index")
    public String index(Model model) {
        model.addAttribute("posts", postsService.findAllDesc());
        return "index";
    }

    @GetMapping("/postsList")
    public Map<String, Object> postsList() {
        Map<String, Object> result = new HashMap<>();
        List<PostsListResponseDto> posts = postsService.findAllDesc();
        SessionUser user = (SessionUser) httpSession.getAttribute("user");
        System.out.println(user);
        result.put("postsList", posts);
        //result.put("userName", user.getName());
        return result;
    }

    @GetMapping("/posts/save")
    public String postsSave() {
        return "posts-save";
    }

    @GetMapping("/pages/save")
    public String pagesSave() {
        return "posts-save";
    }

    @GetMapping("/posts/update/{id}")
    public String postsUpdate(@PathVariable Long id, Model model) {
        PostsResponseDto dto = postsService.findById(id);
        model.addAttribute("post", dto);
        return "posts-update";
    }
}
