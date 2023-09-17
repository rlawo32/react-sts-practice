package com.react.prac.springboot.jpa.domain.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface MemberImageRepository extends JpaRepository<MemberImage, Long> {

    @Query("SELECT m FROM MemberImage m WHERE m.member.id = :memberId")
    Optional<MemberImage> findByMember(@Param("memberId") Long memberId);
}
