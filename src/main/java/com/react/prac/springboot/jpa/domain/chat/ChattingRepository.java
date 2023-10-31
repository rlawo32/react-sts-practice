package com.react.prac.springboot.jpa.domain.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChattingRepository extends JpaRepository<Chatting, Long> {

    @Query("SELECT c FROM Chatting c WHERE c.chatRoomId = :chatRoomId")
    List<Chatting> findByChatRoomId(@Param("chatRoomId") Long chatRoomId);

    @Modifying
    @Query("DELETE FROM Chatting c WHERE c.chatRoomId = :chatRoomId")
    void deleteChattingByChatRoomId(@Param("chatRoomId") Long chatRoomId);
}
