package com.react.prac.springboot.jpa.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByMemberEmailAndProvider(String email, String provider);

    @Query("SELECT m FROM Member m WHERE m.memberEmail = :memberEmail AND m.memberPw = :memberPw")
    boolean findByIdPw(@Param("memberEmail") String memberEmail, @Param("memberPw") String memberPw);

    Optional<Member> findByMemberEmail(String memberEmail);

    boolean existsByMemberEmailAndMemberPw(String memberEmail, String memberPw);

    boolean existsByMemberEmail(String memberEmail);

    boolean existsByMemberNickname(String memberNickname);
}
