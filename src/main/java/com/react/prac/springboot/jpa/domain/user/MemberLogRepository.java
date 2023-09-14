package com.react.prac.springboot.jpa.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface MemberLogRepository extends JpaRepository<MemberLog, Long> {


}
