package com.react.prac.springboot.web;

import com.react.prac.springboot.service.posts.PostsService;
import com.react.prac.springboot.service.users.UsersService;
import com.react.prac.springboot.util.EmailUtil;
import com.react.prac.springboot.web.dto.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// @CrossOrigin(originPatterns = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
public class IndexController {

    private final PostsService postsService;
    private final UsersService usersService;

    @GetMapping("/index")
    public String index(Model model) {
        model.addAttribute("posts", postsService.findAllDesc());
        return "index";
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

    @GetMapping("/users/sendAuthCode")
    public Map<String, Object> sendAuthCode(HttpServletRequest request) {
        System.out.println(request);
        return EmailUtil.sendAuthCode(request.getParameter("userEmail"));
    }

    @PostMapping("/users/signUp")
    public ResponseDto<?> signUp(@RequestBody UsersSignUpDto requestDto) {
        System.out.println("SignUp!!!!!!!!!!!" + requestDto.toString());

        ResponseDto<?> result = usersService.signUp(requestDto);

        System.out.println(result);

        return result;
    }

    @GetMapping("/users/signUpDuplicationChk")
    public boolean signUpDuplicationChk(HttpServletRequest request) {
        String userEmail = request.getParameter("userEmail");
        String userNickName = request.getParameter("userNickName");

        boolean result = false;

        if(userEmail != null) {
            System.out.println("이메일 확인 : " + userEmail);
            result = usersService.emailDuplicationChk(userEmail);
        } else {
            System.out.println("닉네임 확인 : " + userNickName);
            result = usersService.nickNameDuplicationChk(userNickName);
        }
        System.out.println("중복체크 : " + result);

        return result;
    }

//    @PostMapping("/users/signIn")
//    public UsersSignInResponseDto signIn(@RequestBody UsersSignInDto requestDto) {
//        System.out.println("SignIn!!!!!!!!!!!");
//
//        UsersSignInResponseDto loginUser = usersService.signIn(requestDto);
//
//        return loginUser;
//    }

    @PostMapping("/users/signIn")
    public ResponseDto<UsersSignInResponseDto> signIn(@RequestBody UsersSignInDto requestDto) {
        System.out.println("SignIn!!!!!!!!!!!");

        ResponseDto<UsersSignInResponseDto> result = usersService.signIn(requestDto);

        return result;
    }
}
