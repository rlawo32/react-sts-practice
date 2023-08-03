package com.react.prac.springboot.service.posts;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import com.react.prac.springboot.jpa.domain.board.MainBoardRepository;
import com.react.prac.springboot.web.dto.board.MainBoardListResponseDto;
import com.react.prac.springboot.web.dto.board.BoardResponseDto;
import com.react.prac.springboot.web.dto.board.BoardSaveRequestDto;
import com.react.prac.springboot.web.dto.board.BoardUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final MainBoardRepository mainBoardRepository;

    @Transactional
    public Long save(BoardSaveRequestDto requestDto) {
        return mainBoardRepository.save(requestDto.toEntity()).getBoardNo();
    }

    @Transactional
    public Long update(Long id, BoardUpdateRequestDto requestDto) {
        MainBoard posts = mainBoardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        posts.update(requestDto.getTitle(), requestDto.getContent());

        return id;
    }

    public BoardResponseDto findById (Long id) {
        MainBoard entity = mainBoardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));

        return new BoardResponseDto(entity);
    }

    @Transactional
    public List<MainBoardListResponseDto> findAllDesc() {
        return mainBoardRepository.findAllDesc().stream()
                .map(MainBoardListResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        MainBoard posts = mainBoardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        mainBoardRepository.delete(posts);
    }
}
