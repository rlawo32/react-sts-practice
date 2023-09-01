package com.react.prac.springboot.service.posts;

import com.react.prac.springboot.jpa.domain.board.*;
import com.react.prac.springboot.jpa.domain.user.Member;
import com.react.prac.springboot.jpa.domain.user.MemberRepository;
import com.react.prac.springboot.web.dto.ResponseDto;
import com.react.prac.springboot.web.dto.board.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final MainBoardRepository mainBoardRepository;
    private final MemberRepository memberRepository;
    private final BoardRecommendRepository boardRecommendRepository;
    private final BoardCommentRepository boardCommentRepository;

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

    public BoardDetailResponseDto findByBoardId (Long boardId) {
        MainBoard entity = mainBoardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. boardId=" + boardId));

        return new BoardDetailResponseDto(entity);
    }

    @Transactional
    public Map<String, Object> findAllDesc(HttpServletRequest request) {

        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지
        int pagePerBlock = Integer.parseInt(request.getParameter("pagePerBlock")); // 하단 페이지 블럭
        String pageSort = request.getParameter("pageSort"); // 탭 정렬 조건
        int totalPage = 0; // pageable에서 출력한 전체 페이지

        String searchText = request.getParameter("searchText");  // 검색어
        String searchSelect = request.getParameter("searchSelect"); // 검색 조건

        List<BoardListResponseDto> pagingList = new ArrayList<>();

        if(searchText.equals("")) {
            if(pageSort.equals("")) {
                Page<MainBoard> pageable = mainBoardRepository.findAll(PageRequest.of(page, recordPerPage));
                pagingList = pageable.stream()
                        .map(BoardListResponseDto::new)
                        .collect(Collectors.toList());

                totalPage = pageable.getTotalPages();
                System.out.println("111 전체 페이징 카운트 : " + pageable.getTotalPages());
            } else {
                // Sort sort = Sort.by(pageSort).descending();
                Page<MainBoard> pageable = mainBoardRepository.findAllByBoardTab(pageSort ,PageRequest.of(page, recordPerPage));
                pagingList = pageable.stream()
                        .map(BoardListResponseDto::new)
                        .collect(Collectors.toList());

                totalPage = pageable.getTotalPages();
                System.out.println("111 정렬 페이징 카운트 : " + pageable.getTotalPages());
            }
        } else {
            if(searchSelect.equals("title")) {
                if(pageSort.equals("")) {
                    Page<MainBoard> pageable = mainBoardRepository.findAllByBoardTitleContaining(searchText, PageRequest.of(page, recordPerPage));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                    System.out.println("222 전체 페이징 카운트 : " + pageable.getTotalPages());
                } else {
                    // Sort sort = Sort.by(pageSort).descending();
                    Page<MainBoard> pageable = mainBoardRepository.findAllByBoardTabAndBoardTitleContaining(pageSort, searchText, PageRequest.of(page, recordPerPage));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                    System.out.println("222 정렬 페이징 카운트 : " + pageable.getTotalPages());
                }
            } else if(searchSelect.equals("content")) {
                if(pageSort.equals("")) {
                    Page<MainBoard> pageable = mainBoardRepository.findAllByBoardContentContaining(searchText, PageRequest.of(page, recordPerPage));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                    System.out.println("333 전체 페이징 카운트 : " + pageable.getTotalPages());
                } else {
                    // Sort sort = Sort.by(pageSort).descending();
                    Page<MainBoard> pageable = mainBoardRepository.findAllByBoardTabAndBoardContentContaining(pageSort, searchText, PageRequest.of(page, recordPerPage));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                    System.out.println("333 정렬 페이징 카운트 : " + pageable.getTotalPages());
                }
            } else if(searchSelect.equals("nickname")) {
                if(pageSort.equals("")) {
                    Page<MainBoard> pageable = mainBoardRepository.findAllByBoardAuthorContaining(searchText, PageRequest.of(page, recordPerPage));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                    System.out.println("444 전체 페이징 카운트 : " + pageable.getTotalPages());
                } else {
                    // Sort sort = Sort.by(pageSort).descending();
                    Page<MainBoard> pageable = mainBoardRepository.findAllByBoardTabAndBoardAuthorContaining(pageSort, searchText, PageRequest.of(page, recordPerPage));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                    System.out.println("444 정렬 페이징 카운트 : " + pageable.getTotalPages());
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("boardList", pagingList);
        result.put("totalPage", totalPage);

        return result;
    }

    @Transactional
    public void delete(Long id) {
        MainBoard posts = mainBoardRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. id=" + id));
        mainBoardRepository.delete(posts);
    }

    // 추천 기능

    public boolean recommendCheck(Long boardId, Long memberId) {
        MainBoard mainBoard = mainBoardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + boardId));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

        if(boardRecommendRepository.findByMainBoardAndMember(mainBoard, member).isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    @Transactional
    public ResponseDto<?> recommendUp(RecommendRequestDto requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(requestDto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + requestDto.getBoardId()));

        Member member = memberRepository.findById(requestDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + requestDto.getMemberId()));

        try {
            if(boardRecommendRepository.findByMainBoardAndMember(mainBoard, member).isPresent()) {
                return ResponseDto.setFailed("Data Already Exists");
            } else {
                BoardRecommend boardRecommend = BoardRecommend.builder()
                        .mainBoard(mainBoard)
                        .member(member)
                        .build();

                boardRecommendRepository.save(boardRecommend);
                recommendCountUpdate(requestDto.getBoardId(), true);
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Success", null);
    }

    @Transactional
    public ResponseDto<?> recommendDown(RecommendRequestDto requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(requestDto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + requestDto.getBoardId()));

        Member member = memberRepository.findById(requestDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + requestDto.getMemberId()));

        BoardRecommend boardRecommend = boardRecommendRepository.findByMainBoardAndMember(mainBoard, member)
                .orElseThrow(() -> new IllegalArgumentException("관련 ID가 없습니다."));

        try {
            boardRecommendRepository.delete(boardRecommend);
            recommendCountUpdate(requestDto.getBoardId(), false);
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Success", null);
    }

    public void recommendCountUpdate(Long boardId, boolean x) {
        if(x) {
            mainBoardRepository.updateByBoardRecommendCount(boardId, 1);
        } else {
            mainBoardRepository.updateByBoardRecommendCount(boardId, -1);
        }
    }

    // 조회 기능
    @Transactional
    public ResponseDto<?> viewsUp(RecommendRequestDto requestDto) {
        // 중복 방지 추가

        try {
            mainBoardRepository.updateByBoardViewsCount(requestDto.getBoardId());
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Success", null);
    }

    // 이전글 , 다음글
    @Transactional
    public Long findBoardPrevAndNext(Long boardId, String orderId) {

        if(orderId.equals("prev")) {
            return mainBoardRepository.findByPrev(boardId);
        } else {
            return mainBoardRepository.findByNext(boardId);
        }
    }

    @Transactional
    public Map<String, Object> boardPrevAndNextSelect(Long boardId) {

        Long boardIdPrev = mainBoardRepository.findByPrev(boardId);
        Long boardIdNext = mainBoardRepository.findByNext(boardId);

        Map<String, Object> result = new HashMap<>();
        result.put("boardIdPrev", boardIdPrev);
        result.put("boardIdNext", boardIdNext);

        return result;
    }

    // 댓글 기능
    @Transactional
    public ResponseDto<?> commentSave(CommentRequestDto requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(requestDto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + requestDto.getBoardId()));

        Member member = memberRepository.findById(requestDto.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + requestDto.getMemberId()));

        String commentNickname = memberRepository.findByMemberNickname(requestDto.getMemberId());

        Long commentParentId = requestDto.getCommentParentId();
        if(commentParentId == null) {
            commentParentId = boardCommentRepository.findByNvlCommentId(requestDto.getBoardId()) + 1;
        }

        Long commentTargetId = requestDto.getCommentTargetId();
        if(commentTargetId == null) {
            commentTargetId = 0L;
        }

        Long commentNestedId = requestDto.getCommentNestedId();
        if(commentNestedId == null) {
            commentNestedId = 0L;
        }

        Long commentNestedLevel = requestDto.getCommentNestedLevel();
        if(commentNestedLevel == null) {
            commentNestedLevel = 0L;
        } else {
            commentNestedLevel += 1;
        }

        String commentContent = requestDto.getCommentContent();
        String createdDate = requestDto.getCreatedDate();
        String modifiedDate = requestDto.getModifiedDate();

        System.out.println("comment target id 값 확인 : " + commentTargetId);
        System.out.println("comment nested id 값 확인 : " + commentNestedId);
        System.out.println("comment nested level 값 확인 : " + commentNestedLevel);

        try {
            BoardComment boardComment = BoardComment.builder()
                    .commentParentId(commentParentId)
                    .commentTargetId(commentTargetId)
                    .commentNestedId(commentNestedId)
                    .commentNestedLevel(commentNestedLevel)
                    .commentContent(commentContent)
                    .commentNickname(commentNickname)
                    .mainBoard(mainBoard)
                    .member(member)
                    .createdDate(createdDate)
                    .modifiedDate(modifiedDate)
                    .commentIsDeleted(true)
                    .build();

            boardCommentRepository.save(boardComment);
        } catch (Exception e) {
            return ResponseDto.setFailed("Data Base Error!");
        }

        return ResponseDto.setSuccess("Success", null);
    }

    public Map<String, Object> commentList(HttpServletRequest request) {

        Long boardId = Long.valueOf(request.getParameter("boardId"));
        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지

        Page<BoardComment> pageable = boardCommentRepository.findByBoardComment(boardId, PageRequest.of(page, recordPerPage));
        int totalPage = pageable.getTotalPages();
        Long totalComments = pageable.getTotalElements();

        List<CommentResponseDto> commentList = pageable.stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());

        System.out.println("전달된 데이터 확인" + boardId);
        System.out.println("전체 페이지 확인" + pageable.getTotalPages());


        Map<String, Object> result = new HashMap<>();
        result.put("commentList", commentList);
        result.put("totalPage", totalPage);
        result.put("totalComments", totalComments);

        return result;
    }
}
