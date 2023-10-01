package com.react.prac.springboot.service.users;

import com.react.prac.springboot.config.security.SecurityUtil;
import com.react.prac.springboot.config.security.TokenProvider;
import com.react.prac.springboot.config.security.dto.TokenDto;
import com.react.prac.springboot.config.security.dto.TokenRequestDto;
import com.react.prac.springboot.jpa.domain.user.*;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.user.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class MemberService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final MemberRepository memberRepository;
    private final MemberWithdrawRepository memberWithdrawRepository;
    private final MemberLogRepository memberLogRepository;
    private final MemberImageRepository memberImageRepository;
    private final RefreshTokenRepository refreshTokenRepository;

    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${file.path}")
    private String uploadFolder;

    @Transactional
    public ResponseDto<?> signUp(MemberSignUpRequestDto requestDto) {

        String memberEmail = requestDto.getMemberEmail();

        try {
            if(memberRepository.existsByMemberEmail(memberEmail)) {

                Member member = memberRepository.findByMemberEmail(memberEmail)
                        .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다. Email : " + memberEmail));

                if(member.getMemberSecessionYn().equals("Y")) {
                    return ResponseDto.setFailed("This Withdraw Member Email!");
                } else {
                    return ResponseDto.setFailed("Existed Email!");
                }
            } else {
                memberRepository.save(requestDto.toMember(passwordEncoder));
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Sign Up Success", null);
    }

    @Transactional
    public boolean emailDuplicationChk(String memberEmail) {

        return memberRepository.existsByMemberEmail(memberEmail);
    }

    @Transactional
    public boolean nicknameDuplicationChk(String memberNickname) {

        return memberRepository.existsByMemberNickname(memberNickname);
    }

    @Transactional
    public boolean emailAndNicknameDuplicationChk(String memberEmail, String memberNickname) {

        boolean result = memberRepository.existsByMemberNickname(memberNickname);
        boolean exists = memberRepository.existsByMemberEmailAndMemberNickname(memberEmail, memberNickname);

        if(exists) {
            result = false;
        }

        return result;
    }

    @Transactional
    public boolean passwordDuplicationChk(String passwordCheck) {

        Long memberId = SecurityUtil.getCurrentMemberId();

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

        boolean matchPassword = passwordEncoder.matches(passwordCheck, member.getMemberPw());

        return matchPassword;
    }

    @Transactional
    public ResponseDto<TokenDto> signIn(MemberSignInRequestDto requestDto) {

        String memberEmail = requestDto.getMemberEmail();
        String memberPw = requestDto.getMemberPw();
        TokenDto tokenDto = new TokenDto();

        try {
            Member member = memberRepository.findByMemberEmail(memberEmail)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자 이메일이 없습니다. id : " + memberEmail));

            MemberLog memberLog = new MemberLog();

            if(member.getMemberSecessionYn().equals("Y")) {
                return ResponseDto.setFailed("This User Has Withdrawn!");
            } else {
                boolean matchPassword = passwordEncoder.matches(memberPw, member.getMemberPw());

                if(!matchPassword) {
                    memberLog = MemberLog.builder()
                            .member(member)
                            .logMemberEmail(memberEmail)
                            .logLoginSuccess("F")
                            .logLoginReason("비밀번호 인증 실패")
                            .createdDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm")))
                            .build();

                    memberLogRepository.save(memberLog);

                    return ResponseDto.setFailed("Sign In Information Does Not Match");
                } else {
                    // 1. Login ID/PW 를 기반으로 AuthenticationToken 생성
                    UsernamePasswordAuthenticationToken authenticationToken = requestDto.toAuthentication();

                    // 2. 실제로 검증 (사용자 비밀번호 체크) 이 이루어지는 부분
                    //    authenticate 메서드가 실행이 될 때 CustomUserDetailsService 에서 만들었던 loadUserByUsername 메서드가 실행됨
                    Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

                    if(authentication.isAuthenticated()) {
                        String username = authentication.getName();
                        Long memberId = Long.valueOf(username);

                        member = memberRepository.findById(memberId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

                        memberLog = MemberLog.builder()
                                .member(member)
                                .logMemberEmail(memberEmail)
                                .logLoginSuccess("S")
                                .logLoginReason("JWT 인증 성공")
                                .createdDate(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm")))
                                .build();

                        memberLogRepository.save(memberLog);
                    }

                    // 3. 인증 정보를 기반으로 JWT 토큰 생성
                    tokenDto = tokenProvider.generateTokenDto(authentication);

                    // 4. RefreshToken 저장
                    RefreshToken refreshToken = RefreshToken.builder()
                            .key(authentication.getName())
                            .value(tokenDto.getRefreshToken())
                            .build();

                    refreshTokenRepository.save(refreshToken);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Sign In Success", tokenDto);
    }

    @Transactional
    public ResponseDto<TokenDto> reissue(TokenRequestDto requestDto) {

        TokenDto tokenDto = new TokenDto();

        try {
            // 1. Refresh Token 검증
            if (!tokenProvider.validateToken(requestDto.getRefreshToken())) {
                return ResponseDto.setFailed("Refresh Token 이 유효하지 않습니다.");
            } else {
                // 2. Access Token 에서 Member ID 가져오기
                Authentication authentication = tokenProvider.getAuthentication(requestDto.getRefreshToken());

                // 3. 저장소에서 Member ID 를 기반으로 Refresh Token 값 가져옴
                RefreshToken refreshToken = refreshTokenRepository.findByKey(authentication.getName())
                        .orElseThrow(() -> new RuntimeException("로그아웃 된 사용자입니다."));

                // 4. Refresh Token 일치하는지 검사
                if (!refreshToken.getValue().equals(requestDto.getRefreshToken())) {
                    return ResponseDto.setFailed("토큰의 유저 정보가 일치하지 않습니다.");
                } else {
                    // 5. 새로운 토큰 생성
                    tokenDto = tokenProvider.generateTokenDto(authentication);

                    // 6. 저장소 정보 업데이트
                    RefreshToken newRefreshToken = refreshToken.updateValue(tokenDto.getRefreshToken());
                    refreshTokenRepository.save(newRefreshToken);
                }
            }

        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        // 토큰 발급
        return ResponseDto.setSuccess("Reissue Success", tokenDto);
    }

    // 회원 정보조회
    @Transactional
    public ResponseDto<MemberInfoResponseDto> memberInfo(Long memberId) {

        MemberInfoResponseDto memberInfoResponseDto;

        try {
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

            MemberLog memberLog = memberLogRepository.findByRecentLog(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자의 로그인 로그가 없습니다. id : " + memberId));

            String recentLogDate = memberLog.getCreatedDate();
            System.out.println("최신 로그인 확인 : " + recentLogDate);

            memberInfoResponseDto = new MemberInfoResponseDto(member);
            memberInfoResponseDto.setRecentLogDate(recentLogDate);
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("memberInfo Success", memberInfoResponseDto);
    }

    // 회원 수정
    @Transactional
    public Long memberUpdate(HttpServletRequest request) {

        Long memberId = SecurityUtil.getCurrentMemberId();
        String memberNickname = request.getParameter("memberNickname");
        String memberBirth = request.getParameter("memberBirth");

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

        member.infoUpdate(memberNickname, memberBirth);

        return memberId;
    }

    // 비밀번호 변경 & 비밀번호 찾기
    @Transactional
    public ResponseDto<?> passwordUpdate(HttpServletRequest request) {

        String memberEmail = request.getParameter("memberEmail");
        Long memberId = 0L;

        try {
            if(memberEmail != null) {
                Member member = memberRepository.findByMemberEmail(memberEmail)
                        .orElseThrow(() -> new IllegalArgumentException("해당 사용자 이메일이 없습니다. email : " + memberEmail));

                if(member.getMemberSecessionYn().equals("Y")) {
                    return ResponseDto.setFailed("This Withdraw Member!!");
                } else {
                    memberId = member.getId();
                    member.passwordUpdate(passwordEncoder.encode(request.getParameter("changePassword")));
                }
            } else {
                memberId = SecurityUtil.getCurrentMemberId();

                Member member = memberRepository.findById(memberId)
                        .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다."));

                member.passwordUpdate(passwordEncoder.encode(request.getParameter("changePassword")));
            }
        } catch(Exception e) {
            return ResponseDto.setFailed("DataBase Error!!");
        }

        return ResponseDto.setSuccess("Password Change Success!!", memberId);
    }

    // 회원 탈퇴
    @Transactional
    public ResponseDto<?> memberSecession(MemberSignInRequestDto requestDto) {

        String memberEmail = requestDto.getMemberEmail();
        String memberPassword = requestDto.getMemberPw();

        try {
            Member member = memberRepository.findByMemberEmail(memberEmail)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자 이메일이 없습니다. email : " + memberEmail));

            boolean matchPassword = passwordEncoder.matches(memberPassword, member.getMemberPw());

            System.out.println("매칭 패스워드 : " + matchPassword);

            if(matchPassword) {
                member.memberSecession("Y");

                MemberWithdraw memberWithdraw = MemberWithdraw.builder()
                        .memberId(member.getId())
                        .memberEmail(member.getMemberEmail())
                        .memberNickname(member.getMemberNickname())
                        .build();

                memberWithdrawRepository.save(memberWithdraw);

                RefreshToken refreshToken = refreshTokenRepository.findByKey(String.valueOf(member.getId()))
                        .orElseThrow(() -> new RuntimeException("해당 사용자의 토큰이 존재하지 않습니다. id : " + member.getId()));

                refreshTokenRepository.delete(refreshToken);
            } else {
                return ResponseDto.setFailed("Unmatched Password!");
            }
        } catch(Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Secession Success!", null);
    }

    @Transactional
    public ResponseDto<?> memberImageUpload(MultipartFile multipartFile) {

        //동일한 사진을 업로드 하였을 때 사진이 덮어씌워지는 것을 방지하기 위함
        UUID uuid = UUID.randomUUID();
        String imageFileName = uuid + "_" + multipartFile.getOriginalFilename();

        System.out.println("이미지 파일 이름 확인 : " + imageFileName);

        // 디렉토리 경로
        Path dir = Paths.get(uploadFolder);
        Path imageFilePath = Paths.get(uploadFolder + imageFileName);

        System.out.println("이미지 파일 PATH 확인 : " + imageFilePath);

        try {
            if(!Files.exists(dir)) {
                Files.createDirectory(dir);
            }
            Files.write(imageFilePath, multipartFile.getBytes());

            Member member = memberRepository.findById(SecurityUtil.getCurrentMemberId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

            MemberImage memberImage = MemberImage.builder()
                    .member(member)
                    .caption("프로필 이미지")
                    .memberImageName(imageFileName)
                    .build();

            memberImageRepository.save(memberImage);
            memberRepository.updateByMemberPicture(SecurityUtil.getCurrentMemberId(), imageFileName);

        } catch(IOException i) {
            i.printStackTrace();
            return ResponseDto.setFailed("Upload Error!");
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Database Error!");
        }

        return ResponseDto.setSuccess("Image Upload Success", null);
    }

    @Transactional
    public ResponseDto<?> memberImageDelete() {

        Long memberId = SecurityUtil.getCurrentMemberId();
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

        String picture = member.getPicture();
        Path imageFilePath = Paths.get(uploadFolder + picture);

        try {
            Files.deleteIfExists(imageFilePath);

            memberImageRepository.deleteByMember(memberId);
            memberRepository.updateByMemberPicture(memberId, "");
        } catch(IOException i) {
            i.printStackTrace();
            return ResponseDto.setFailed("Upload Error!");
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("Database Error!");
        }

        return ResponseDto.setSuccess("Image Upload Success", null);
    }

    @Transactional
    public Map<String, Object> memberLog(HttpServletRequest request) {

        Long memberId = SecurityUtil.getCurrentMemberId();
        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

        Page<MemberLog> pageable = memberLogRepository.findByMemberLog(member.getId(), PageRequest.of(page, recordPerPage));

        int totalPage = pageable.getTotalPages();
        int totalLoginLog = (int) pageable.getTotalElements();

        List<MemberLogResponseDto> loginLogList = pageable.stream()
                .map(MemberLogResponseDto::new)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("loginLogList", loginLogList);
        result.put("totalPage", totalPage);
        result.put("totalLoginLog", totalLoginLog);

        return result;
    }
}
