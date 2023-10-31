package com.react.prac.springboot.web.dto.chat;

import com.react.prac.springboot.jpa.domain.chat.Chatting;
import lombok.*;

import java.io.Serializable;

@Getter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChattingRequestDto implements Serializable {

    private String senderName;
    private Long senderId;
    private Long chatRoomId;
    private String content;
    // private String sendDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm"));
    private String sendDate;

    public void setSendTimeAndSender(String sendDate, Long senderId, String senderName) {
        this.senderName = senderName;
        this.senderId = senderId;
        this.sendDate = sendDate;
    }

    public Chatting convertEntity() {
        return Chatting.builder()
                .senderName(senderName)
                .senderId(senderId)
                .chatRoomId(chatRoomId)
                .content(content)
                .sendDate(sendDate)
                .build();
    }
}
