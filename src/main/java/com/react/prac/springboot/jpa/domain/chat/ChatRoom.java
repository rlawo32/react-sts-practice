package com.react.prac.springboot.jpa.domain.chat;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.springframework.data.annotation.CreatedDate;

@Entity
@Getter
@Table(name = "ChatRoom")
@DynamicInsert
@AllArgsConstructor
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_room_id", nullable = false)
    private Long id;

    @Column(name = "chat_room_name", nullable = false)
    private String chatRoomName;

    @Column(name = "create_member_id", nullable = false)
    private Long createMemberId;

    @Column(name = "create_member_name", nullable = false)
    private String createMemberName;

    @Column(name = "join_member_id", nullable = false)
    private Long joinMemberId;

    @Column(columnDefinition = "integer default 0", name = "join_personnel", nullable = false)
    private int joinPersonnel;

    @Column(nullable = false)
    @CreatedDate
    private String createdDate;

    @Builder
    public ChatRoom(String chatRoomName, Long createMemberId, String createMemberName, Long joinMemberId, String createdDate) {
        this.chatRoomName = chatRoomName;
        this.createMemberId = createMemberId;
        this.createMemberName = createMemberName;
        this.joinMemberId = joinMemberId;
        this.createdDate = createdDate;
    }

    public ChatRoom joinMemberUpdate(Long joinMemberId) {
        this.joinMemberId = joinMemberId;

        return this;
    }

    public ChatRoom joinPersonnelUpdate(int cnt) {
        this.joinPersonnel = this.joinPersonnel + cnt;

        return this;
    }

}
