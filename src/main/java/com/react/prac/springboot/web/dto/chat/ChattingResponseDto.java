package com.react.prac.springboot.web.dto.chat;

import com.react.prac.springboot.jpa.domain.chat.Chatting;
import lombok.Getter;

@Getter
public class ChattingResponseDto {

    private Long chattingId;
    private String senderName;
    private Long senderId;
    private Long chatRoomId;
    private String content;
    private String sendDate;

    public ChattingResponseDto(Chatting chatting) {
        this.chattingId = chatting.getId();
        this.senderName = chatting.getSenderName();
        this.senderId = chatting.getSenderId();
        this.chatRoomId = chatting.getChatRoomId();
        this.content = chatting.getContent();
        this.sendDate = chatting.getSendDate();
    }

}
