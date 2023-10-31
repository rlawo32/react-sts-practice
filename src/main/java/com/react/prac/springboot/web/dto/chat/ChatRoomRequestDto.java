package com.react.prac.springboot.web.dto.chat;

import com.react.prac.springboot.jpa.domain.chat.ChatRoom;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@NoArgsConstructor
public class ChatRoomRequestDto {

    private String chatRoomName;
    private Long createMemberId;
    private String createMemberName;
    private Long joinMemberId;
    private String createdDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));

    public ChatRoom toEntity() {
        return ChatRoom.builder()
                .chatRoomName(chatRoomName)
                .createMemberId(createMemberId)
                .createMemberName(createMemberName)
                .joinMemberId(joinMemberId)
                .createdDate(createdDate)
                .build();
    }

}
