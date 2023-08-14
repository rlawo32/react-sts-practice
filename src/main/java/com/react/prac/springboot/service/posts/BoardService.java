package com.react.prac.springboot.service.posts;

import com.react.prac.springboot.jpa.domain.board.MainBoard;
import com.react.prac.springboot.jpa.domain.board.MainBoardRepository;
import com.react.prac.springboot.util.BoardUtil;
import com.react.prac.springboot.web.dto.board.BoardListResponseDto;
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
    public Long boardInsert(BoardSaveRequestDto requestDto) {
        return mainBoardRepository.save(requestDto.toEntity()).getId();
    }

    @Transactional
    public Long update(Long id, BoardUpdateRequestDto requestDto) {
        MainBoard posts = mainBoardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        posts.update(requestDto.getTitle(), requestDto.getContent());

        return id;
    }

    public BoardResponseDto findByBoardId (Long boardId) {
        MainBoard entity = mainBoardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. boardId=" + boardId));

        return new BoardResponseDto(entity);
    }

    @Transactional
    public List<BoardListResponseDto> findAllDesc() {
        return mainBoardRepository.findAllDesc().stream()
                .map(BoardListResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        MainBoard posts = mainBoardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        mainBoardRepository.delete(posts);
    }
}
