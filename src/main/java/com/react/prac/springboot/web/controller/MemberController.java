package com.react.prac.springboot.web.controller;

import com.react.prac.springboot.config.security.SecurityUtil;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.jpa.domain.member.MemberImage;
import com.react.prac.springboot.jpa.domain.member.MemberImageRepository;
import com.react.prac.springboot.service.members.MemberService;
import com.react.prac.springboot.util.MemberUtil;
import com.react.prac.springboot.web.dto.*;
import com.react.prac.springboot.web.dto.member.*;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
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

        return MemberUtil.sendAuthCode(request.getParameter("memberEmail"));
    }

    @PostMapping("/signUp")
    public CommonResponseDto<?> signUp(@RequestBody MemberSignUpRequestDto requestDto) {

        CommonResponseDto<?> result = memberService.signUp(requestDto);

        return result;
    }

    @GetMapping("/signUpDuplicationChk")
    public boolean signUpDuplicationChk(HttpServletRequest request) {
        String memberEmail = request.getParameter("memberEmail");
        String memberNickname = request.getParameter("memberNickname");

        boolean result = false;

        if(memberEmail != null && memberNickname == null) {
            System.out.println("이메일 중복 체크 !!");
            result = memberService.emailDuplicationChk(memberEmail);
        } else if(memberEmail == null && memberNickname != null) {
            System.out.println("닉네임 중복 체크 !!");
            result = memberService.nicknameDuplicationChk(memberNickname);
        } else {
            System.out.println("이메일/닉네임 중복 체크 !!");
            result = memberService.emailAndNicknameDuplicationChk(memberEmail, memberNickname);
        }

        return result;
    }

    @GetMapping("/passwordDuplicationChk")
    public boolean passwordDuplicationChk(HttpServletRequest request) {

        return memberService.passwordDuplicationChk(request.getParameter("passwordCheck"));
    }

    @PostMapping("/signIn")
    public CommonResponseDto<TokenDto> signIn(@RequestBody MemberSignInRequestDto requestDto) {

        CommonResponseDto<TokenDto> result = memberService.signIn(requestDto);

        return result;
    }

    @PostMapping("/memberInfo")
    public CommonResponseDto<MemberInfoResponseDto> findMemberInfo() {

        CommonResponseDto<MemberInfoResponseDto> result = memberService.memberInfo(SecurityUtil.getCurrentMemberId());

        return result;
    }

    @PutMapping("/memberUpdate")
    public Long memberUpdate(HttpServletRequest request) {

        return memberService.memberUpdate(request);
    }

    @PutMapping("/passwordUpdate")
    public CommonResponseDto<?> passwordUpdate(HttpServletRequest request) {

        CommonResponseDto<?> result = memberService.passwordUpdate(request);

        return result;
    }

    @PutMapping("/memberSecession")
    public CommonResponseDto<?> passwordUpdate(@RequestBody MemberSignInRequestDto requestDto) {

        CommonResponseDto<?> result = memberService.memberSecession(requestDto);

        return result;
    }

    @PostMapping("/imageUpload")
    public CommonResponseDto<?> imageUpload(MultipartFile multipartFile) {

        CommonResponseDto<?> result = memberService.memberImageUpload(multipartFile);

        return result;
    }

    @DeleteMapping("/imageDelete")
    public CommonResponseDto<?> imageDelete() {

        CommonResponseDto<?> result = memberService.memberImageDelete();

        return result;
    }

    @GetMapping("/imageView")
    public String imageView(HttpServletResponse response) throws IOException {

        MemberImage memberImage = memberImageRepository.findByMember(SecurityUtil.getCurrentMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

        FileInputStream fis = null;
        BufferedInputStream bis = null;
        ServletOutputStream sos = null;

        response.setContentType("image/gif");

        String imageName = memberImage.getMemberImageName();
        String imagePath = uploadFolder + File.separator + imageName;

        System.out.println("이미지 경로 확인 1 : " + imagePath);

        File file = new File(imagePath);

        System.out.println("이미지 경로 확인 2 : " + file);

        fis = new FileInputStream(file);

        System.out.println("이미지 경로 확인 3 : " + fis.read());

        bis = new BufferedInputStream(fis);

        System.out.println("이미지 경로 확인 4 : " + bis.read());

        sos = response.getOutputStream();

        byte[] buf = new byte[(int)file.length()];
        int length = 0;

        fis.read(buf);

        while( (length = fis.read(buf)) != -1){
            sos.write(buf, 0, length);
        }

        if(bis != null) {
            bis.close();
        }
        if(sos != null) {
            sos.close();
        }

        return null;
    }

    @GetMapping("/memberLog")
    public Map<String, Object> findMemberLog(HttpServletRequest request) {

        return memberService.memberLog(request);
    }
}
