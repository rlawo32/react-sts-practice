package com.react.prac.springboot.web;

import com.react.prac.springboot.config.auth.SecurityUtil;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.jpa.domain.user.MemberImage;
import com.react.prac.springboot.jpa.domain.user.MemberImageRepository;
import com.react.prac.springboot.service.users.MemberService;
import com.react.prac.springboot.util.EmailUtil;
import com.react.prac.springboot.web.dto.*;
import com.react.prac.springboot.web.dto.user.*;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Map;

// @CrossOrigin(originPatterns = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;
    private final MemberImageRepository memberImageRepository;

    @Value("${file.path}")
    private String uploadFolder;

    @GetMapping("/sendAuthCode")
    public Map<String, Object> sendAuthCode(HttpServletRequest request) {

        return EmailUtil.sendAuthCode(request.getParameter("userEmail"));
    }

    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody MemberSignUpRequestDto requestDto) {

        ResponseDto<?> result = memberService.signUp(requestDto);

        return result;
    }

    @GetMapping("/signUpDuplicationChk")
    public boolean signUpDuplicationChk(HttpServletRequest request) {
        String userEmail = request.getParameter("userEmail");
        String userNickName = request.getParameter("userNickName");

        boolean result = false;

        if(userEmail != null) {
            System.out.println("이메일 확인 : " + userEmail);
            result = memberService.emailDuplicationChk(userEmail);
        } else {
            System.out.println("닉네임 확인 : " + userNickName);
            result = memberService.nickNameDuplicationChk(userNickName);
        }
        System.out.println("중복체크 : " + result);

        return result;
    }

    @PostMapping("/signIn")
    public ResponseDto<TokenDto> signIn(@RequestBody MemberSignInRequestDto requestDto) {

        ResponseDto<TokenDto> result = memberService.signIn(requestDto);

        return result;
    }

    @PostMapping("/memberInfo")
    public ResponseDto<MemberInfoResponseDto> findMemberInfo() {

        ResponseDto<MemberInfoResponseDto> result = memberService.memberInfo(SecurityUtil.getCurrentMemberId());

        return result;
    }

    @PostMapping("/imageUpload")
    public ResponseDto<?> imageUpload(MultipartFile multipartFile) {

        ResponseDto<?> result = memberService.memberImageUpload(multipartFile);

        return result;
    }

    @GetMapping("/imageView")
    public void imageView(HttpServletResponse response) throws IOException {

        MemberImage memberImage = memberImageRepository.findByMember(SecurityUtil.getCurrentMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

        response.setContentType("image/gif");
        ServletOutputStream bout = response.getOutputStream();

        String imageName = memberImage.getPost_image_url();
        String imagePath = uploadFolder + imageName;

        FileInputStream fis = new FileInputStream(imagePath);

        byte[] buffer = new byte[10];

    }

    @PutMapping("/memberUpdate")
    public Long memberUpdate(HttpServletRequest request) {

        return memberService.memberUpdate(request);
    }


    @GetMapping("/memberLog")
    public Map<String, Object> findMemberLog(HttpServletRequest request) {

        return memberService.memberLog(request);
    }
}
