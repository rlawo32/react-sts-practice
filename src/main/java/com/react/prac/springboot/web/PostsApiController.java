package com.react.prac.springboot.web;

import com.react.prac.springboot.service.posts.PostsService;
import com.react.prac.springboot.web.dto.PostsResponseDto;
import com.react.prac.springboot.web.dto.PostsSaveRequestDto;
import com.react.prac.springboot.web.dto.PostsUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class PostsApiController {

    private final PostsService postsService;

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
}
