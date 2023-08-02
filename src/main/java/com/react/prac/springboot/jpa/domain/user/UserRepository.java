package com.react.prac.springboot.jpa.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, String> {

    Optional<Users> findByEmailAndProvider(String email, String provider);

    @Query("SELECT u FROM Users u WHERE u.email = :userEmail AND u.userPw = :userPw")
    boolean findByIdPw(@Param("userEmail") String userEmail, @Param("userPw") String userPw);

    boolean existsByEmailAndUserPw(String userEmail, String userPw);

    boolean existsByEmail(String userEmail);

    boolean existsByUserNickName(String userNickName);
}
