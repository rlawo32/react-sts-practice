package com.react.prac.springboot.jpa.domain.user;

import com.react.prac.springboot.jpa.domain.board.BoardComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface MemberLogRepository extends JpaRepository<MemberLog, Long> {

    @Query("SELECT l FROM MemberLog l WHERE l.member.id = :memberId")
    Page<MemberLog> findByMemberLog(@Param("memberId") Long memberId, Pageable pageable);

}
