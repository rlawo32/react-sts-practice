package com.react.prac.springboot.jpa.domain.chat;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
@Entity
@Getter
@Table(name = "Chatting")
@DynamicInsert
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chatting_id", nullable = false)
    private Long id;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    @Column(name = "chat_room_id", nullable = false)
    private Long chatRoomId;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(nullable = false)
    @CreatedDate
    private String sendDate;

    @Builder
    public Chatting(String senderName, Long senderId, Long chatRoomId, String content, String sendDate) {
        this.senderName = senderName;
        this.senderId = senderId;
        this.chatRoomId = chatRoomId;
        this.content = content;
        this.sendDate = sendDate;
    }
}
