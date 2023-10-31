package com.react.prac.springboot.web.dto.chat;

import com.react.prac.springboot.jpa.domain.chat.ChatRoom;
import lombok.Getter;

@Getter
public class ChatRoomResponseDto {

    private Long chatRoomId;
    private String chatRoomName;
    private Long createMemberId;
    private String createMemberName;
    private Long joinMemberId;
    private int joinPersonnel;
    private String createdDate;
    private int chatRoomNo;

    public ChatRoomResponseDto(ChatRoom chatRoom) {
        this.chatRoomId = chatRoom.getId();
        this.chatRoomName = chatRoom.getChatRoomName();
        this.createMemberId = chatRoom.getCreateMemberId();
        this.createMemberName = chatRoom.getCreateMemberName();
        this.joinMemberId = chatRoom.getJoinMemberId();
        this.joinPersonnel = chatRoom.getJoinPersonnel();
        this.createdDate = chatRoom.getCreatedDate();
    }

}
