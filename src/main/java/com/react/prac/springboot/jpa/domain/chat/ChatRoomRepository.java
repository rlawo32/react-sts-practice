package com.react.prac.springboot.jpa.domain.chat;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT c FROM ChatRoom c")
    Page<ChatRoom> findAllByChatRoomList(Pageable pageable);

    @Query("SELECT c FROM ChatRoom c WHERE c.id = :chatRoomId")
    Optional<ChatRoom> findByChatRoom(@Param("chatRoomId") Long chatRoomId);
}
