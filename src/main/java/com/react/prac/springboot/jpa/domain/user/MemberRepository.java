package com.react.prac.springboot.jpa.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByMemberEmailAndProvider(String email, String provider);

    @Query("SELECT m FROM Member m WHERE m.memberEmail = :memberEmail AND m.memberPw = :memberPw")
    boolean findByIdPw(@Param("memberEmail") String memberEmail, @Param("memberPw") String memberPw);

    @Query("SELECT m.memberNickname FROM Member m WHERE m.id = :memberId")
    String findByMemberNickname(@Param("memberId") Long memberId);

    Optional<Member> findByMemberEmail(String memberEmail);

    boolean existsByMemberEmailAndMemberPw(String memberEmail, String memberPw);

    boolean existsByMemberEmail(String memberEmail);

    boolean existsByMemberNickname(String memberNickname);

    @Modifying
    @Query("UPDATE Member m SET m.picture = :picture WHERE m.id = :memberId")
    void updateByMemberPicture(@Param("memberId") Long memberId, @Param("picture") String picture);

}
