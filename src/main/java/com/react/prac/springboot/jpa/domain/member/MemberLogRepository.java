package com.react.prac.springboot.jpa.domain.member;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface MemberLogRepository extends JpaRepository<MemberLog, Long> {

    @Query("SELECT l FROM MemberLog l WHERE l.member.id = :memberId")
    Page<MemberLog> findByMemberLog(@Param("memberId") Long memberId, Pageable pageable);

    @Query("SELECT l FROM MemberLog l WHERE l.member.id = :memberId ORDER BY l.id DESC LIMIT 1")
    Optional<MemberLog> findByRecentLog(@Param("memberId") Long memberId);

}
