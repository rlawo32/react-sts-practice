package com.react.prac.springboot.service.chats;

import com.react.prac.springboot.config.security.SecurityUtil;
import com.react.prac.springboot.jpa.domain.chat.ChatRoom;
import com.react.prac.springboot.jpa.domain.chat.ChatRoomRepository;
import com.react.prac.springboot.jpa.domain.chat.Chatting;
import com.react.prac.springboot.jpa.domain.chat.ChattingRepository;
import com.react.prac.springboot.jpa.domain.member.Member;
import com.react.prac.springboot.jpa.domain.member.MemberRepository;
import com.react.prac.springboot.web.dto.CommonResponseDto;
import com.react.prac.springboot.web.dto.chat.ChatRoomRequestDto;
import com.react.prac.springboot.web.dto.chat.ChatRoomResponseDto;
import com.react.prac.springboot.web.dto.chat.ChattingRequestDto;
import com.react.prac.springboot.web.dto.chat.ChattingResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChattingRepository chattingRepository;
    private final MemberRepository memberRepository;

    // 채팅방 생성
    @Transactional
    public CommonResponseDto<?> createChatRoom(ChatRoomRequestDto requestDto) {

        Long chatRoomId = 0L;

        try {
            Member member = memberRepository.findById(SecurityUtil.getCurrentMemberId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

            requestDto.setCreateMemberId(member.getId());
            requestDto.setCreateMemberName(member.getMemberNickname());
            requestDto.setJoinMemberId(member.getId());

            chatRoomId = chatRoomRepository.save(requestDto.toEntity()).getId();
        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!");
        }

        return CommonResponseDto.setSuccess("ChatRoom Create Success!", chatRoomId);
    }

    // 채팅방 리스트
    @Transactional
    public Map<String, Object> findAllChatRoomList(HttpServletRequest request) {

        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지

        Page<ChatRoom> pageable = chatRoomRepository.findAllByChatRoomList(PageRequest.of(page, recordPerPage));

        int totalPage = pageable.getTotalPages();

        List<ChatRoomResponseDto> chatRoomList = pageable.stream()
                .map(ChatRoomResponseDto::new)
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("chatRoomList", chatRoomList);
        result.put("totalPage", totalPage);

        return result;
    }

    // 채팅
    public void sendChatting(ChattingRequestDto message) {

        Member member = memberRepository.findById(SecurityUtil.getCurrentMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

        // message 객체에 보낸시간, 보낸사람 memberNo, 닉네임을 셋팅해준다.
        message.setSendTimeAndSender(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm")), member.getId(), member.getMemberNickname());
        // 메시지를 전송한다.
//        sender.send(ChatUtil.KAFKA_TOPIC, message);
    }

    // 채팅 저장
    @Transactional
    public CommonResponseDto<?> saveChatting(ChattingRequestDto message) {

        Long chattingId = 0L;

        try {
            Chatting chatting = message.convertEntity();

            chattingId = chattingRepository.save(chatting).getId();
        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!");
        }

        return CommonResponseDto.setSuccess("Chatting Save Success!", chattingId);
    }

    // 채팅 리스트
    @Transactional
    public List<ChattingResponseDto> findAllChattingList(Long chatRoomId) {

        List<ChattingResponseDto> chattingList = chattingRepository.findByChatRoomId(chatRoomId).stream()
                .map(ChattingResponseDto::new)
                .collect(Collectors.toList());

        return chattingList;
    }

    // 채팅방 삭제
    @Transactional
    public void chatRoomDelete(Long chatRoomId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 채팅방이 없습니다. chatRoomId : " + chatRoomId));

            chatRoomRepository.delete(chatRoom);

            chattingRepository.deleteChattingByChatRoomId(chatRoomId);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    // 채팅방 검사
    @Transactional
    public CommonResponseDto<?> checkChatRoom(Long chatRoomId) {

        boolean enterPossible = true;

        try {
            ChatRoom chatRoom = chatRoomRepository.findByChatRoom(chatRoomId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 채팅방이 없습니다. chatRoomId : " + chatRoomId));

            if(chatRoom.getJoinPersonnel() == 2) {
                enterPossible = false;
            }
        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!");
        }

        return CommonResponseDto.setSuccess("ChatRoom Enter Success!", enterPossible);
    }

    // 채팅방 입장
    @Transactional
    public CommonResponseDto<?> enterChatRoom(Long chatRoomId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findByChatRoom(chatRoomId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 채팅방이 없습니다. chatRoomId : " + chatRoomId));

            if(chatRoom.getCreateMemberId() == SecurityUtil.getCurrentMemberId()) {
                chatRoom.joinPersonnelUpdate(1);
            } else {
                chatRoom.joinMemberUpdate(SecurityUtil.getCurrentMemberId());
                chatRoom.joinPersonnelUpdate(1);
            }

        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!");
        }

        return CommonResponseDto.setSuccess("ChatRoom Enter Success!", null);
    }

    // 채팅방 퇴장
    @Transactional
    public CommonResponseDto<?> quitChatRoom(Long chatRoomId) {
        try {
            ChatRoom chatRoom = chatRoomRepository.findByChatRoom(chatRoomId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 채팅방이 없습니다. chatRoomId : " + chatRoomId));

            chatRoom.joinPersonnelUpdate(-1);

        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!");
        }

        return CommonResponseDto.setSuccess("ChatRoom Enter Success!", null);
    }

    public String memberImageLoad(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

        if(member.getPicture().equals("")) {
            return null;
        }

        return "/upload/" + member.getPicture();
    }

}
