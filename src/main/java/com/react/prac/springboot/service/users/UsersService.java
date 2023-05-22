package com.react.prac.springboot.service.users;

import com.react.prac.springboot.domain.posts.PostsRepository;
import com.react.prac.springboot.domain.user.UserRepository;
import com.react.prac.springboot.web.dto.PostsSaveRequestDto;
import com.react.prac.springboot.web.dto.UsersSignUpDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UsersService {

    private final UserRepository userRepository;

    @Transactional
    public Long save(UsersSignUpDto requestDto) {
        return userRepository.save(requestDto.toUsers()).getId();
    }
}
