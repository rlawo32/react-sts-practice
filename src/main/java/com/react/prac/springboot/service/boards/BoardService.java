package com.react.prac.springboot.service.boards;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.react.prac.springboot.config.security.SecurityUtil;
import com.react.prac.springboot.jpa.domain.board.*;
import com.react.prac.springboot.jpa.domain.member.Member;
import com.react.prac.springboot.jpa.domain.member.MemberRepository;
import com.react.prac.springboot.util.UploadUtil;
import com.react.prac.springboot.web.dto.CommonResponseDto;
import com.react.prac.springboot.web.dto.board.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {

    private final MainBoardRepository mainBoardRepository;
    private final MemberRepository memberRepository;
    private final BoardRecommendRepository boardRecommendRepository;
    private final BoardCommentRepository boardCommentRepository;
    private final BoardImageRepository boardImageRepository;

    private final AmazonS3 s3Client;
    private final UploadUtil uploadUtil;

    @Value("${application.bucket.name}")
    private String bucketName;

    @Value("${file.path}")
    private String uploadFolder;

    @Transactional
    public CommonResponseDto<?> boardInsert(BoardSaveRequestDto requestDto) {

        try {
            Long memberId = SecurityUtil.getCurrentMemberId();

            requestDto.setBoardAuthorId(memberId);
            requestDto.setBoardAuthor(memberRepository.findByMemberNickname(memberId));

            Long boardId = mainBoardRepository.save(requestDto.toEntity()).getId();

            uploadUtil.boardImageInsert(boardId, requestDto.getBoardImage());

        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!");
        }

        return CommonResponseDto.setSuccess("Board Insert Success", null);
    }

    @Transactional
    public CommonResponseDto<?> boardImageInsertS3(MultipartFile files) {

        Map<String, Object> result = new HashMap<>();

        try {
            //동일한 사진을 업로드 하였을 때 사진이 덮어씌워지는 것을 방지하기 위함
            UUID uuid = UUID.randomUUID();
            String imageFileName = uuid + "_" + files.getOriginalFilename();

            File file = uploadUtil.convertMultiPartFileToFile(files);

            s3Client.putObject(new PutObjectRequest(bucketName + "/previewImage", imageFileName, file));
            file.delete();

            URL url = s3Client.getUrl(bucketName + "/previewImage", imageFileName);
            String urlText = "" + url;

            result.put("imgName", imageFileName);
            result.put("imgUrl", urlText);

        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Database Error!");
        }

        return CommonResponseDto.setSuccess("Image Upload Success", result);
    }

    @Transactional
    public CommonResponseDto<?> boardImageDeleteS3(HttpServletRequest request) {
        System.out.println(request.getParameter("imageFileName"));

        try {
            s3Client.deleteObject(new DeleteObjectRequest(bucketName + "/previewImage", request.getParameter("imageFileName")));

        } catch(Exception e) {
            e.printStackTrace();
            return CommonResponseDto.setFailed("Error!");
        }

        return CommonResponseDto.setSuccess("Image Delete Success", null);
    }

    @Transactional
    public Long boardUpdate(Long boardId, BoardUpdateRequestDto requestDto) {

        try {
            MainBoard mainBoard = mainBoardRepository.findById(boardId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. boardId : " + boardId));

            mainBoard.update(requestDto.getBoardCategory(), requestDto.getBoardTab(),
                    requestDto.getBoardTitle(), requestDto.getBoardContent());

            for(int i=0; i<requestDto.getDeleteImage().size(); i++) {
                String boardImage = requestDto.getDeleteImage().get(i);
                String deleteImage = boardImage.substring(boardImage.lastIndexOf("_")+1);
                boardImageRepository.deleteByBoardImageOriginName(boardId, deleteImage);
            }

            for(int j=0; j<requestDto.getSelectDeleteImage().size(); j++) {
                s3Client.deleteObject(new DeleteObjectRequest(bucketName + "/previewImage", requestDto.getSelectDeleteImage().get(j)));
            }

            uploadUtil.boardImageInsert(boardId, requestDto.getBoardImage());
        } catch(Exception e) {
            e.printStackTrace();
        }

        return boardId;
    }

    @Transactional
    public void boardDelete(Long boardId) {

        try {
            MainBoard mainBoard = mainBoardRepository.findById(boardId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. boardId : " + boardId));

            if(boardImageRepository.existsByMainBoard(mainBoard)) {

                List<BoardImageResponseDto> boardImageList = boardImageRepository.findBoardImageByBoardId(boardId).stream()
                        .map(BoardImageResponseDto::new)
                        .collect(Collectors.toList());

                for(int i=0; i<boardImageList.size(); i++) {
                    s3Client.deleteObject(new DeleteObjectRequest(bucketName + "/previewImage", boardImageList.get(i).getBoardImageCustomName()));
                }
            }

            mainBoardRepository.delete(mainBoard);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    @Transactional
    public BoardDetailResponseDto findByDetailBoard(Long boardId) {

        BoardDetailResponseDto boardDetailResponseDto = null;

        try {
            MainBoard mainBoard = mainBoardRepository.findById(boardId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. boardId=" + boardId));

            Long memberId = SecurityUtil.getCurrentMemberId();

            boardDetailResponseDto = new BoardDetailResponseDto(mainBoard);

            if(memberId != null) {
                List<BoardImageResponseDto> boardImageList = boardImageRepository.findBoardImageByBoardId(boardId).stream()
                        .map(BoardImageResponseDto::new)
                        .collect(Collectors.toList());

                boardDetailResponseDto.setBoardImageList(boardImageList);

                Member member = memberRepository.findById(memberId)
                        .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

                boardDetailResponseDto.setLoginMemberId(memberId);

                if(boardRecommendRepository.existsByRecommendCategoryAndRecommendTypeAndMemberAndMainBoard("B", "U", member, mainBoard)) {
                    boardDetailResponseDto.setBoardRecommendUpCheck(1);
                } else {
                    boardDetailResponseDto.setBoardRecommendUpCheck(0);
                }

                if(boardRecommendRepository.existsByRecommendCategoryAndRecommendTypeAndMemberAndMainBoard("B", "D", member, mainBoard)) {
                    boardDetailResponseDto.setBoardRecommendDownCheck(1);
                } else {
                    boardDetailResponseDto.setBoardRecommendDownCheck(0);
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }

        return boardDetailResponseDto;
    }

    @Transactional
    public Map<String, Object> findAllDesc(HttpServletRequest request) {

        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지
        int pagePerBlock = Integer.parseInt(request.getParameter("pagePerBlock")); // 하단 페이지 블럭
        String pageCategory = request.getParameter("pageCategory"); // 카테고리 정렬 조건
        String pageSort = request.getParameter("pageSort"); // 탭 정렬 조건
        int totalPage = 0; // pageable에서 출력한 전체 페이지

        String searchText = request.getParameter("searchText");  // 검색어
        String searchSelect = request.getParameter("searchSelect"); // 검색 조건

        List<BoardListResponseDto> pagingList = new ArrayList<>();

        Long boardAuthorId = SecurityUtil.getCurrentMemberId();

        System.out.println("boardAuthorId 확인 : " + boardAuthorId);
        System.out.println("searchText 확인 : " + searchText);

        System.out.println("pageCategory 확인 : " + pageCategory);
        System.out.println("pageSort 확인 : " + pageSort);


        if(searchSelect.equals("M")) { // 개인이 작성한 글 조회
            Page<MainBoard> pageable = mainBoardRepository.
                    findAllByBoardAuthorId(boardAuthorId,
                            PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
            pagingList = pageable.stream()
                    .map(BoardListResponseDto::new)
                    .collect(Collectors.toList());

            totalPage = pageable.getTotalPages();
        } else {
            if(searchText.equals("")) {
                if(pageCategory.equals("C0") && pageSort.equals("T0")) {
                    Page<MainBoard> pageable = mainBoardRepository.
                            findAll(PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                } else if(pageCategory.equals("C0")) {
                    // Sort sort = Sort.by(pageSort).descending();
                    Page<MainBoard> pageable = mainBoardRepository.
                            findAllByBoardTab(pageSort,
                                    PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                } else if(pageSort.equals("T0")) {
                    // Sort sort = Sort.by(pageSort).descending();
                    Page<MainBoard> pageable = mainBoardRepository.
                            findAllByBoardCategory(pageCategory,
                                    PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                } else {
                    Page<MainBoard> pageable = mainBoardRepository.
                            findAllByBoardCategoryAndBoardTab(pageCategory, pageSort,
                                    PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                    pagingList = pageable.stream()
                            .map(BoardListResponseDto::new)
                            .collect(Collectors.toList());

                    totalPage = pageable.getTotalPages();
                }
            } else {
                if(searchSelect.equals("title")) {
                    if(pageSort.equals("T0") && pageSort.equals("T0")) {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardTitleContaining(searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else if(pageCategory.equals("C0")) {
                        // Sort sort = Sort.by(pageSort).descending();
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardTabAndBoardTitleContaining(pageSort, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else if(pageSort.equals("T0")) {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardCategoryAndBoardTitleContaining(pageCategory, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardCategoryAndBoardTabAndBoardTitleContaining(pageCategory, pageSort, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    }
                } else if(searchSelect.equals("content")) {
                    if(pageSort.equals("T0") && pageSort.equals("T0")) {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardContentContaining(searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else if(pageCategory.equals("C0"))  {
                        // Sort sort = Sort.by(pageSort).descending();
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardTabAndBoardContentContaining(pageSort, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else if(pageSort.equals("T0")) {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardCategoryAndBoardContentContaining(pageCategory, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardCategoryAndBoardTabAndBoardContentContaining(pageCategory, pageSort, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    }
                } else if(searchSelect.equals("nickname")) {
                    if(pageSort.equals("T0") && pageSort.equals("T0")) {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardAuthorContaining(searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else if(pageCategory.equals("C0")) {
                        // Sort sort = Sort.by(pageSort).descending();
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardTabAndBoardAuthorContaining(pageSort, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else if(pageSort.equals("T0")) {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardCategoryAndBoardAuthorContaining(pageCategory, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    } else {
                        Page<MainBoard> pageable = mainBoardRepository.
                                findAllByBoardCategoryAndBoardTabAndBoardAuthorContaining(pageCategory, pageSort, searchText,
                                        PageRequest.of(page, recordPerPage, Sort.by("id").descending()));
                        pagingList = pageable.stream()
                                .map(BoardListResponseDto::new)
                                .collect(Collectors.toList());

                        totalPage = pageable.getTotalPages();
                    }
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("boardList", pagingList);
        result.put("totalPage", totalPage);

        return result;
    }

    // 추천 기능
    @Transactional
    public boolean recommendCheck(HttpServletRequest request) { // 제거 확인

        Long boardId = Long.valueOf(request.getParameter("boardId"));
        Long memberId = Long.valueOf(request.getParameter("memberId"));
        String recommendType = request.getParameter("recommendType");

        MainBoard mainBoard = mainBoardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + boardId));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));


        if(boardRecommendRepository.findByRecommendCategoryAndRecommendTypeAndMainBoardAndMember("B", recommendType, mainBoard, member).isPresent()) {
            return true;
        } else {
            return false;
        }
    }

    @Transactional
    public CommonResponseDto<?> recommendExec(RecommendRequestDto requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(requestDto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + requestDto.getBoardId()));

        Member member = memberRepository.findById(SecurityUtil.getCurrentMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

        Long commentId = requestDto.getCommentId();
        String recommendType = requestDto.getRecommendType();

        try {
            if(commentId == null) {
                if(boardRecommendRepository.findByRecommendCategoryAndRecommendTypeAndMainBoardAndMember("B", recommendType, mainBoard, member).isPresent()) {
                    return CommonResponseDto.setFailed("Data Already Exists");
                } else {
                    BoardRecommend boardRecommend = BoardRecommend.builder()
                            .recommendType(recommendType)
                            .recommendCategory("B")
                            .member(member)
                            .mainBoard(mainBoard)
                            .build();

                    boardRecommendRepository.save(boardRecommend);
                    mainRecommendCountUpdate(recommendType, requestDto.getBoardId(), true);
                }
            } else {
                BoardComment boardComment = boardCommentRepository.findById(commentId)
                        .orElseThrow(() -> new IllegalArgumentException("해당 댓글 ID가 없습니다. id : " + commentId));

                if(boardRecommendRepository.findByRecommendCategoryAndRecommendTypeAndMainBoardAndMemberAndBoardComment("C",  recommendType, mainBoard, member, boardComment).isPresent()) {
                    return CommonResponseDto.setFailed("Data Already Exists");
                } else {
                    BoardRecommend boardRecommend = BoardRecommend.builder()
                            .recommendType(recommendType)
                            .recommendCategory("C")
                            .member(member)
                            .mainBoard(mainBoard)
                            .boardComment(boardComment)
                            .build();

                    boardRecommendRepository.save(boardRecommend);
                    commentRecommendCountUpdate(recommendType, commentId, true);
                }
            }

        } catch (Exception e) {
            return CommonResponseDto.setFailed("Data Base Error!");
        }

        return CommonResponseDto.setSuccess("Success", null);
    }

    @Transactional
    public CommonResponseDto<?> recommendCancel(RecommendRequestDto requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(requestDto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + requestDto.getBoardId()));

        Member member = memberRepository.findById(SecurityUtil.getCurrentMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

        Long commentId = requestDto.getCommentId();
        String recommendType = requestDto.getRecommendType();

        try {
            BoardRecommend boardRecommend = new BoardRecommend();

            if(commentId == null) {
                boardRecommend = boardRecommendRepository.findByRecommendCategoryAndRecommendTypeAndMainBoardAndMember("B", recommendType, mainBoard, member)
                        .orElseThrow(() -> new IllegalArgumentException("관련 ID가 없습니다."));

                boardRecommendRepository.delete(boardRecommend);
                mainRecommendCountUpdate(recommendType, requestDto.getBoardId(), false);
            } else {
                BoardComment boardComment = boardCommentRepository.findById(commentId)
                        .orElseThrow(() -> new IllegalArgumentException("해당 댓글 ID가 없습니다. id : " + commentId));

                boardRecommend = boardRecommendRepository.findByRecommendCategoryAndRecommendTypeAndMainBoardAndMemberAndBoardComment("C", recommendType, mainBoard, member, boardComment)
                        .orElseThrow(() -> new IllegalArgumentException("관련 ID가 없습니다."));

                boardRecommendRepository.delete(boardRecommend);
                commentRecommendCountUpdate(recommendType, commentId, false);
            }
        } catch (Exception e) {
            return CommonResponseDto.setFailed("Data Base Error!");
        }

        return CommonResponseDto.setSuccess("Success", null);
    }

    @Transactional
    public void mainRecommendCountUpdate(String recommendType, Long boardId, boolean x) {
        if(recommendType.equals("U")) {
            if(x) {
                mainBoardRepository.updateByBoardRecommendUpCount(boardId, 1);
            } else {
                mainBoardRepository.updateByBoardRecommendUpCount(boardId, -1);
            }
        } else if(recommendType.equals("D")) {
            if(x) {
                mainBoardRepository.updateByBoardRecommendDownCount(boardId, 1);
            } else {
                mainBoardRepository.updateByBoardRecommendDownCount(boardId, -1);
            }
        }
    }
    @Transactional
    public void commentRecommendCountUpdate(String recommendType, Long commentId, boolean x) {
        if(recommendType.equals("U")) {
            if(x) {
                boardCommentRepository.updateByCommentRecommendUpCount(commentId, 1);
            } else {
                boardCommentRepository.updateByCommentRecommendUpCount(commentId, -1);
            }
        } else if(recommendType.equals("D")) {
            if(x) {
                boardCommentRepository.updateByCommentRecommendDownCount(commentId, 1);
            } else {
                boardCommentRepository.updateByCommentRecommendDownCount(commentId, -1);
            }
        }
    }

    // 조회 기능
    @Transactional
    public CommonResponseDto<?> viewsUp(RecommendRequestDto requestDto) {
        // 중복 방지 추가
        Long memberId = SecurityUtil.getCurrentMemberId();

        try {
            mainBoardRepository.updateByBoardViewsCount(requestDto.getBoardId());
        } catch (Exception e) {
            return CommonResponseDto.setFailed("Data Base Error!");
        }

        return CommonResponseDto.setSuccess("Success", null);
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
    public CommonResponseDto<?> commentSave(CommentRequestDto requestDto) {

        MainBoard mainBoard = mainBoardRepository.findById(requestDto.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글 ID가 없습니다. id : " + requestDto.getBoardId()));

        Member member = memberRepository.findById(SecurityUtil.getCurrentMemberId())
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + SecurityUtil.getCurrentMemberId()));

        String commentNickname = memberRepository.findByMemberNickname(SecurityUtil.getCurrentMemberId());

        Long commentParentId = requestDto.getCommentParentId();
        Long commentTargetId = requestDto.getCommentTargetId();
        Long commentNestedId = requestDto.getCommentNestedId();
        Long commentNestedLevel = requestDto.getCommentNestedLevel();


        if(commentParentId == null) {
//            commentParentId = boardCommentRepository.findByNvlCommentId(requestDto.getBoardId()) + 1;
            commentParentId = 0L;
            commentTargetId = 0L;
            commentNestedId = 0L;
        }

        if(commentNestedLevel == null) {
            commentNestedLevel = 0L;
        } else {
            commentNestedLevel += 1;
        }

        String commentContent = requestDto.getCommentContent();
        String createdDate = requestDto.getCreatedDate();
        String modifiedDate = requestDto.getModifiedDate();

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
                    .commentIsDeleted(true)
                    .build();

            boardCommentRepository.save(boardComment);

            commentChildCountUpdate(commentParentId, true);
        } catch (Exception e) {
            return CommonResponseDto.setFailed("Data Base Error!");
        }

        return CommonResponseDto.setSuccess("Success", null);
    }

    @Transactional
    public void commentChildCountUpdate(Long commentParentId, boolean x) {
        if(x) {
            boardCommentRepository.updateByCommentChildCnt(commentParentId, 1);
        } else {
            boardCommentRepository.updateByCommentChildCnt(commentParentId, -1);
        }
    }

    @Transactional
    public Map<String, Object> commentList(HttpServletRequest request) {

        Long boardId = Long.valueOf(request.getParameter("boardId"));

        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지

        Page<BoardComment> pageable = Page.empty();
        int totalPage = 0;
        int totalComments = 0;

        if(boardId == 0) {
            pageable = boardCommentRepository.findByMemberComment(SecurityUtil.getCurrentMemberId(), PageRequest.of(page, recordPerPage));

            totalPage = pageable.getTotalPages();
            totalComments = (int) pageable.getTotalElements();
        } else {
            pageable = boardCommentRepository.findByBoardComment(boardId, PageRequest.of(page, recordPerPage, Sort.by("commentParentId").and(Sort.by("id"))));

            totalPage = pageable.getTotalPages();
            totalComments = (int) pageable.getTotalElements();

            mainBoardRepository.updateByBoardCommentCount(boardId, totalComments);
        }

        List<CommentResponseDto> commentList = pageable.stream()
                .map(CommentResponseDto::new)
                .collect(Collectors.toList());

        Long memberId = SecurityUtil.getCurrentMemberId();

        if(memberId != null) {
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 사용자 ID가 없습니다. id : " + memberId));

            for(int i=0; i<commentList.size(); i++) {
                Long commentId = commentList.get(i).getCommentId();
                Long findCategory = commentList.get(i).getBoardId();
                BoardComment boardComment = boardCommentRepository.findById(commentId)
                        .orElseThrow(() -> new IllegalArgumentException("해당 댓글 ID가 없습니다. id : " + commentId));

                commentList.get(i).setCommentBoardCategory(mainBoardRepository.findByBoardCategory(findCategory));

                if(boardRecommendRepository.existsByRecommendTypeAndMemberAndBoardComment("U", member, boardComment)) {
                    commentList.get(i).setCommentRecommendUpCheck(1);
                } else {
                    commentList.get(i).setCommentRecommendUpCheck(0);
                }

                if(boardRecommendRepository.existsByRecommendTypeAndMemberAndBoardComment("D", member, boardComment)) {
                    commentList.get(i).setCommentRecommendDownCheck(1);
                } else {
                    commentList.get(i).setCommentRecommendDownCheck(0);
                }
            }
        }

        System.out.println("댓글 확인 : " + totalComments);

        Map<String, Object> result = new HashMap<>();
        result.put("commentList", commentList);
        result.put("totalPage", totalPage);
        result.put("totalComments", totalComments);
        result.put("presentLoginMemberId", memberId);

        return result;
    }

    @Transactional
    public void commentDelete(Long commentId) {
        BoardComment boardComment = boardCommentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("해당 댓글이 없습니다. commentId : " + commentId));

        if(boardComment.getCommentChildCnt() > 0) {
            String deleteMessage = "[삭제된 댓글입니다.]";
            boardComment.commentUpdate(deleteMessage);
        } else {
            boardCommentRepository.delete(boardComment);
        }

    }

    @Transactional
    public Map<String, Object> recommendList(HttpServletRequest request) {

        Long memberId = SecurityUtil.getCurrentMemberId();

        int recordPerPage = Integer.parseInt(request.getParameter("recordPerPage")); // 한 페이지에 출력할 수
        int page = Integer.parseInt(request.getParameter("page")); // 현재 페이지

        Page<BoardRecommend> pageableB = Page.empty();
        Page<BoardRecommend> pageableC = Page.empty();

        int totalPageB = 0;
        int totalRecommendsB = 0;
        int totalPageC = 0;
        int totalRecommendsC = 0;

        pageableB = boardRecommendRepository.findByBoardRecommend(memberId, "B", PageRequest.of(page, recordPerPage));

        totalPageB = pageableB.getTotalPages();
        totalRecommendsB = (int) pageableB.getTotalElements();

        pageableC = boardRecommendRepository.findByBoardRecommend(memberId, "C", PageRequest.of(page, recordPerPage));

        totalPageC = pageableC.getTotalPages();
        totalRecommendsC = (int) pageableC.getTotalElements();

        List<RecommendResponseDto> boardRecommendList = pageableB.stream()
                .map(RecommendResponseDto::new)
                .collect(Collectors.toList());

        List<RecommendResponseDto> commentRecommendList = pageableC.stream()
                .map(RecommendResponseDto::new)
                .collect(Collectors.toList());

        for(int i=0; i<boardRecommendList.size(); i++) {
            Long boardId = boardRecommendList.get(i).getBoardId();

            MainBoard mainBoard = mainBoardRepository.findById(boardId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 댓글 ID가 없습니다. id : " + boardId));

            boardRecommendList.get(i).setTargetAuthor(mainBoard.getBoardAuthor());
            boardRecommendList.get(i).setTargetData(mainBoard.getBoardTitle());
        }

        for(int i=0; i<commentRecommendList.size(); i++) {
            Long commentId= commentRecommendList.get(i).getCommentId();

            BoardComment boardComment = boardCommentRepository.findById(commentId)
                    .orElseThrow(() -> new IllegalArgumentException("해당 댓글 ID가 없습니다. id : " + commentId));

            commentRecommendList.get(i).setTargetAuthor(boardComment.getCommentNickname());
            commentRecommendList.get(i).setTargetData(boardComment.getCommentContent());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("boardRecommendList", boardRecommendList);
        result.put("commentRecommendList", commentRecommendList);
        result.put("totalPageB", totalPageB);
        result.put("totalRecommendsB", totalRecommendsB);
        result.put("totalPageC", totalPageC);
        result.put("totalRecommendsC", totalRecommendsC);

        return result;
    }
}
