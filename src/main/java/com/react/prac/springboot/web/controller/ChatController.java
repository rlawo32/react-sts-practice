package com.react.prac.springboot.web.controller;

import com.react.prac.springboot.service.chats.ChatService;
import com.react.prac.springboot.web.dto.CommonResponseDto;
import com.react.prac.springboot.web.dto.chat.ChatRoomRequestDto;
import com.react.prac.springboot.web.dto.chat.ChattingRequestDto;
import com.react.prac.springboot.web.dto.chat.ChattingResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate template;

    // chatRoom 만들기
    @PostMapping("/createChatRoom")
    public CommonResponseDto<?> createChatRoom(@RequestBody ChatRoomRequestDto requestDto) {

        CommonResponseDto<?> result = chatService.createChatRoom(requestDto);

        return result;
    }

    // chatRoom 불러오기
    @GetMapping("/chatRoomList")
    public Map<String, Object> chatRoomList(HttpServletRequest request) {

        return chatService.findAllChatRoomList(request);
    }

//    @MessageMapping("/sendChatting")
//    public void sendChatting(@Valid ChattingRequestDto message) {
//        chatService.sendChatting(message);
//    }

//    @MessageMapping("/sendMessage")
//    @SendTo("/topic/chatting")
//    public ChatMessageDto message(ChattingRequestDto message) throws Exception{
//
//        Thread.sleep(100);
//
//        return new ChatMessageDto(message.getContent(), message.getSenderName());
//    }

    @MessageMapping(value = "/sendMessage")
    @SendTo("/sub/chatting")
    public void message(ChattingRequestDto message){

        template.convertAndSend("/sub/chat/room/" + message.getChatRoomId(), message);
    }

    // chatting 저장
    @PostMapping("/saveChatting")
    public CommonResponseDto<?> saveChatting(@RequestBody ChattingRequestDto chattingRequestDto) {

        CommonResponseDto<?> result = chatService.saveChatting(chattingRequestDto);

        return result;
    }

    // chatting 기록
    @GetMapping("/chattingList/{chatRoomId}")
    public List<ChattingResponseDto> chattingList(@PathVariable("chatRoomId") Long chatRoomId) {

        return chatService.findAllChattingList(chatRoomId);
    }

    // chatRoom 삭제
    @DeleteMapping("/chatRoomDelete/{chatRoomId}")
    public void chatRoomDelete(@PathVariable Long chatRoomId) {

        chatService.chatRoomDelete(chatRoomId);
    }

    // chatRoom 검사
    @PostMapping("/checkChatRoom/{chatRoomId}")
    public CommonResponseDto<?> checkChatRoom(@PathVariable Long chatRoomId) {

        CommonResponseDto<?> result = chatService.checkChatRoom(chatRoomId);

        return result;
    }

    // chatRoom 입장
    @PostMapping("/enterChatRoom/{chatRoomId}")
    public CommonResponseDto<?> enterChatRoom(@PathVariable Long chatRoomId) {

        CommonResponseDto<?> result = chatService.enterChatRoom(chatRoomId);

        return result;
    }

    // chatRoom 퇴장
    @PostMapping("/quitChatRoom/{chatRoomId}")
    public CommonResponseDto<?> quitChatRoom(@PathVariable Long chatRoomId) {

        CommonResponseDto<?> result = chatService.quitChatRoom(chatRoomId);

        return result;
    }

    @GetMapping("/imageLoad")
    public String imageLoad(HttpServletRequest request) {

        String memberStr = request.getParameter("memberId");
        Long memberId = Long.valueOf(request.getParameter("memberId"));

        return chatService.memberImageLoad(memberId);
    }

}
