import AppBarNavigation from "../Navigation/HeaderNavigation";
import './BoardDetail.scss';
import '../Layouts/MainView.scss';
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import ImageModal from "./ImageModal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp as recommendUp,
        faThumbsDown as recommendDown,
        faReply as nestedArrow,
        faAnglesLeft as leftArrow,
        faAnglesRight as rightArrow,
        faHouse as buttonHouse} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as recommendUpCancel,
        faThumbsDown as recommendDownCancel} from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import Linkify from "linkify-react";
import {getCookie} from "../Navigation/Cookie";

const BoardDetail = (props) => {
    const locationURL = window.location.href;
    const navigate = useNavigate();

    const category_name = props.category;
    const subTab_name = props.subTab;

    const [isLoginCheck, setIsLoginCheck] = useState(0);
    // const [detailLoginMemberId, setDetailLoginMemberId] = useState(0);
    const [commentLoginMemberId, setCommentLoginMemberId] = useState(0);
    const [imageModal, setImageModal] = useState(false);
    const [imageModalUrl, setImageModalUrl] = useState(false);

    const [boardDetail, setBoardDetail] = useState({
        boardId: '',
        boardCategory: '',
        boardTab: '',
        boardTitle: '',
        boardContent: '',
        boardAuthorId: '',
        boardAuthor: '',
        boardRecommendUpCnt: '',
        boardRecommendDownCnt: '',
        boardViewsCnt: '',
        boardRecommendUpCheck: '',
        boardRecommendDownCheck: '',
        loginMemberId: ''
    });

    const [prevId, setPrevId] = useState(0);
    const [nextId, setNextId] = useState(0);

    const [mainRecommendCheck, setMainRecommendCheck] = useState(0);
    const [commentRecommendCheck, setCommentRecommendCheck] = useState(0);

    const [commentState, setCommentState] = useState(false);
    const [commentId, setCommentId] = useState(""); // 댓글 id,
    const [commentParentId, setCommentParentId] = useState(""); // 대댓들을 달 부모 댓글
    const [commentTargetId, setCommentTargetId] = useState(""); // 대댓을 달 댓글 id target
    const [nestedId, setNestedId] = useState(""); // 대댓 id
    const [nestedLevel, setNestedLevel] = useState(""); // 대댓 level
    const [nestedBox, setNestedBox] = useState(false); // 대댓 box view 여부
    const [nestedText, setNestedText] = useState("");

    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [commentList, setCommentList] = useState([{
        commentLogNo: '',
        commentId: '',
        commentNestedId: '',
        commentNestedLevel: '',
        commentContent: '',
        boardId: '',
        memberId: '',
        memberNickname: '',
        createdDate: '',
        modifiedDate: '',
        commentRecommendUpCnt: '',
        commentRecommendDownCnt: '',
        commentRecommendUpCheck: '',
        commentRecommendDownCheck: '',
        commentBoardCategory: ''
    }]);

    const commentData = {
        commentParentId: "",
        commentTargetId: "",
        commentNestedId: "",
        commentNestedLevel: "",
        boardId: props.boardId,
        commentContent: commentText
    }

    const nestedData = {
        commentParentId: commentParentId,
        commentTargetId: commentTargetId,
        commentNestedId: nestedId,
        commentNestedLevel: nestedLevel,
        boardId: props.boardId,
        commentContent: nestedText
    }

    const pagination = () => {
        let result = [];
        for (let i=0; i<totalPage; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}><button className="list-item">{i+1}</button></li>);
        }
        return result;
    }

    const copyClipBoardHandler = (text) => {
        navigator.clipboard.writeText(text);

        alert('복사 성공 \n' + text);
    }

    // const detailUpdateHandler = async () => {
    //     await axios({
    //         method: "PUT",
    //         url: '/board/detailUpdate',
    //         data: JSON.stringify(commentData),
    //         headers: {'Content-type': 'application/json'}
    //     }).then(() => {
    //
    //     })
    // }

    const detailDeleteHandler = async () => {
        // eslint-disable-next-line eqeqeq
        if (window.confirm("해당 게시글을 삭제하시겠습니까?") == true){
            await axios({
                method: "DELETE",
                url: '/board/boardDelete/' + boardDetail.boardId
            }).then(() => {
                alert('게시글이 삭제되었습니다.');
                navigate('/board');
            })
        }
    }

    const onClickMainRecommendUp = async (e) => {

        // eslint-disable-next-line eqeqeq
        if(isLoginCheck == 1) {
            const mainRecommendData = {
                boardId: props.boardId,
                commentId: "",
                recommendType: "U"
            }

            // eslint-disable-next-line eqeqeq
            if(e == 1) {
                await axios({
                    method: "DELETE",
                    url: '/board/recommendCancel',
                    data: JSON.stringify(mainRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setMainRecommendCheck(mainRecommendCheck - 1);
            } else {
                await axios({
                    method: "POST",
                    url: '/board/recommendExec',
                    data: JSON.stringify(mainRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setMainRecommendCheck(mainRecommendCheck + 1);
            }
        } else {
            alert("로그인 하시길 바랍니다.");
        }
    }

    const onClickMainRecommendDown = async (e) => {

        // eslint-disable-next-line eqeqeq
        if(isLoginCheck == 1) {
            const mainRecommendData = {
                boardId: props.boardId,
                commentId: "",
                recommendType: "D"
            }

            // eslint-disable-next-line eqeqeq
            if(e == 1) {
                await axios({
                    method: "DELETE",
                    url: '/board/recommendCancel',
                    data: JSON.stringify(mainRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setMainRecommendCheck(mainRecommendCheck - 1);
            } else {
                await axios({
                    method: "POST",
                    url: '/board/recommendExec',
                    data: JSON.stringify(mainRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setMainRecommendCheck(mainRecommendCheck + 1);
            }
        } else {
            alert("로그인 하시길 바랍니다.");
        }
    }

    const onClickCommentRecommendUp = async (selectCommentId) => {

        const comment_target = document.getElementById(selectCommentId).getElementsByClassName("comment-recommendUp");
        const CommentRecommendUpChecked = comment_target[0].children[0].children[0].checked;

        // eslint-disable-next-line eqeqeq
        if(isLoginCheck == 1) {
            const commentRecommendData = {
                boardId: props.boardId,
                commentId: selectCommentId,
                recommendType: "U"
            }

            if(CommentRecommendUpChecked) {
                await axios({
                    method: "DELETE",
                    url: '/board/recommendCancel',
                    data: JSON.stringify(commentRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setCommentRecommendCheck(commentRecommendCheck - 1);
            } else {
                await axios({
                    method: "POST",
                    url: '/board/recommendExec',
                    data: JSON.stringify(commentRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setCommentRecommendCheck(commentRecommendCheck + 1);
            }
        } else {
            alert("로그인 하시길 바랍니다.");
        }
    }

    const onClickCommentRecommendDown = async (selectCommentId) => {

        const comment_target = document.getElementById(selectCommentId).getElementsByClassName("comment-recommendDown");
        const CommentRecommendDownChecked = comment_target[0].children[0].children[0].checked;

        // eslint-disable-next-line eqeqeq
        if(isLoginCheck == 1) {
            const commentRecommendData = {
                boardId: props.boardId,
                commentId: selectCommentId,
                recommendType: "D"
            }

            if(CommentRecommendDownChecked) {
                await axios({
                    method: "DELETE",
                    url: '/board/recommendCancel',
                    data: JSON.stringify(commentRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setCommentRecommendCheck(commentRecommendCheck - 1);
            } else {
                await axios({
                    method: "POST",
                    url: '/board/recommendExec',
                    data: JSON.stringify(commentRecommendData),
                    headers: {'Content-type': 'application/json'}
                });
                setCommentRecommendCheck(commentRecommendCheck + 1);
            }
        } else {
            alert("로그인 하시길 바랍니다.");
        }
    }

    const changeDetailBoard = async (itemID, orderID) => {
        // eslint-disable-next-line eqeqeq
        if(itemID != null) {
            await axios({
                method: "GET",
                url: '/board/boardPrevAndNext',
                params: {boardId: itemID, orderId: orderID}
            })
            // eslint-disable-next-line eqeqeq
            if(orderID == 'prev') {
                props.changeBoardId(prevId);
            } else {
                props.changeBoardId(nextId);
            }
        } else {
            props.changeBoardId(itemID);
        }
    }

    const changeCommentTextHandler = ({target: {value}}) => {
        setCommentText(value);
    }

    const changeNestedTextHandler = ({target: {value}}) => {
        setNestedText(value);
    }

    const commentSaveHandler = async () => {
        setCommentState(!commentState);
        // eslint-disable-next-line eqeqeq
        if(commentText == "") {
            alert("내용을 입력해주세요");
        } else {
            await axios({
                method: "POST",
                url: '/board/commentSave',
                data: JSON.stringify(commentData),
                headers: {'Content-type': 'application/json'}
            }).then(() => {
                setCommentState(!commentState);
                setCommentText("");
                document.getElementById("comment-text").value='';
                // window.location.reload();
            })
        }
    }

    const commentDeleteHandler = async (commentId) => {
        // eslint-disable-next-line eqeqeq
        if(window.confirm("댓글을 삭제하시겠습니까?") == true) {
            await axios({
                method: "DELETE",
                url: '/board/commentDelete/' + commentId
            }).then(() => {
                alert('댓글이 삭제되었습니다.');
                setCommentState(!commentState);
                // window.location.reload();
            })
        }
    }

    const nestedSaveHandler = async (e) => {
        const selectCommentId = e.target.value;
        setCommentState(!commentState);
        // eslint-disable-next-line eqeqeq
        if(nestedText == "") {
            alert("내용을 입력해주세요");
        } else {
            await axios({
                method: "POST",
                url: '/board/commentSave',
                data: JSON.stringify(nestedData),
                headers: {'Content-type': 'application/json'}
            }).then(() => {
                setCommentState(!commentState);
                const targetDiv_3 = document.getElementById(selectCommentId);
                const nestedView_3 = targetDiv_3.lastChild;
                if(nestedView_3) {
                    nestedView_3.style.display = "none";
                }
                setNestedText("");
                document.getElementById("nested-text").value='';
                // window.location.reload();
            })
        }
    }

    const nestedActionHandler = (box, e, parent_id, nested_id, nested_level) => {
        const selectCommentId = e.target.value;

        setCommentParentId(parent_id);
        setCommentTargetId(selectCommentId);
        setNestedId(nested_id);
        setNestedLevel(nested_level);

        const targetDiv_1 = document.getElementById(selectCommentId);
        const nestedView_1 = targetDiv_1.lastChild;

        // eslint-disable-next-line eqeqeq
        if(commentId != selectCommentId) {
            box = false;
            const targetDiv_2 = document.getElementById(commentId);
            if(targetDiv_2) {
                const nestedView_2 = targetDiv_2.lastChild;
                if(nestedView_2) {
                    nestedView_2.style.display = "none";
                }
            }
        }

        if(box) {
            nestedView_1.style.display = "none";
            setNestedBox(false);
        } else {
            nestedView_1.style.display = "block";
            setNestedBox(true);
        }

        setCommentId(selectCommentId);
    }

    useEffect(() => {
        const paging = {
            boardId: props.boardId,
            recordPerPage: 10,
            page: pageNo
        }

        // eslint-disable-next-line eqeqeq
        if(props.boardId != null) {
            const getBoards = async () => {

                const selectBoard = await axios({
                    method: "GET",
                    url: '/board/boardPrevAndNextSelect',
                    params: {boardId: props.boardId}
                })

                const boardComments = await axios({
                    method: "GET",
                    url: '/board/commentList',
                    params: paging
                })

                setPrevId(selectBoard.data.boardIdPrev);
                setNextId(selectBoard.data.boardIdNext);
                setCommentList(boardComments.data.commentList);
                setTotalPage(boardComments.data.totalPage);
                setTotalComments(boardComments.data.totalComments);
                setCommentLoginMemberId(boardComments.data.presentLoginMemberId);
            };

            getBoards();
        } else {
            const locationParameter = window.location.pathname;

            const getBoards = async () => {

                const selectBoard = await axios({
                    method: "GET",
                    url: '/board/boardPrevAndNextSelect',
                    params: {boardId: locationParameter.substring(7)}
                })

                const comments = await axios({
                    method: "GET",
                    url: '/board/commentList',
                    params: paging
                })

                setPrevId(selectBoard.data.boardIdPrev);
                setNextId(selectBoard.data.boardIdNext);
                setCommentList(comments.data.commentList);
                setTotalPage(comments.data.totalPage);
                setTotalComments(comments.data.totalComments);
                setCommentLoginMemberId(comments.data.presentLoginMemberId);
            };

            getBoards();
        }
    }, [prevId, nextId, props.boardId, pageNo, commentState, commentRecommendCheck])
    // prevId:이전글, nextId:다음글, props.id:게시판에서 선택한 게시글 id,
    // pageNo:댓글 페이지 이동,
    // 추후 다수 사용자로 인한 트래픽 확인 => commentState:댓글 작성 후 바로 추가, commentRecommendCheck:댓글 추천 체크

    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        if(props.boardId != null) {
            const getBoards = async () => {
                const detail = await axios({
                    method: "POST",
                    url: '/board/detailBoard/' + props.boardId
                })

                setBoardDetail(detail.data);
                // setDetailLoginMemberId(detail.data.loginMemberId);
                // setCommentList(detail.data.boardComments);
            };

            getBoards();
        } else {
            const locationParameter = window.location.pathname;

            const getBoards = async () => {
                const detail = await axios({
                    method: "POST",
                    url: '/board/detailBoard/' + locationParameter.substring(7)
                })

                setBoardDetail(detail.data);
                // setDetailLoginMemberId(detail.data.loginMemberId);
            };

            getBoards();
        }

        if(getCookie('refreshToken')) {
            setIsLoginCheck(1);
        } else {
            setIsLoginCheck(0);
        }
    }, [props.boardId, mainRecommendCheck, isLoginCheck]);
    // props.id:url 직접 입력 시를 위함 (세부적인 기능 체크 필요)
    // 추후 다수 사용자로 인한 트래픽 확인 => mainRecommendCheck:게시글 추천 체크

    // const nestedSaveHandler = (box, e) => {
    //     const selectNestedId = e.target.value;
    //
    //     const targetDiv_1 = document.getElementById(selectNestedId);
    //     const parentDiv = document.createElement("div");
    //     const childDiv_1 = document.createElement("div");
    //     const childDiv_2 = document.createElement("div");
    //     const childDiv_3 = document.createElement("div");
    //     parentDiv.classList.add("nested-write");
    //     childDiv_1.classList.add("nested-tag");
    //     childDiv_2.classList.add("nested-box");
    //     childDiv_3.classList.add("nested-btn");
    //
    //     const removeDiv = document.querySelector(".nested-write");
    //
    //     const childTag_1 = document.createElement("div");
    //     childTag_1.classList.add("nested-header1");
    //
    //     childTag_1.innerHTML = "댓글 달기";
    //     childDiv_1.appendChild(childTag_1);
    //
    //     const childTag_2 = document.createElement("div");
    //     childTag_2.classList.add("nested-header2");
    //     const childClose = document.createElement("button");
    //     childClose.classList.add("nested-close");
    //     childClose.innerHTML = "닫기";
    //
    //     childClose.onclick = function() {
    //         const remove = document.querySelector(".nested-write");
    //         targetDiv_1.removeChild(remove);
    //         setNestedBox(false);
    //     }
    //
    //     childTag_2.appendChild(childClose);
    //     childDiv_1.appendChild(childTag_2);
    //
    //     const childText = document.createElement("textarea");
    //     childText.setAttribute("id", "nested-text");
    //     childText.setAttribute("placeholder", "댓글을 입력하세요");
    //
    //     childDiv_2.appendChild(childText);
    //
    //     const childBtn = document.createElement("button");
    //     childBtn.classList.add("btn-design");
    //     childBtn.innerHTML = "등록";
    //
    //     childBtn.onclick = function() {
    //
    //         console.log(childText.textContent);
    //         console.log(nestedText);
    //         alert("등록 완료!!!");
    //     }
    //
    //     childDiv_3.appendChild(childBtn);
    //
    //     if(nestedId != selectNestedId) {
    //         box = false;
    //         const targetDiv_2 = document.getElementById(nestedId);
    //         if(targetDiv_2) { // 초기 state 대응
    //             if(targetDiv_2.hasChildNodes()) {
    //                 targetDiv_2.removeChild(removeDiv);
    //             }
    //         }
    //     }
    //
    //     if(box) {
    //         targetDiv_1.removeChild(removeDiv);
    //         setNestedBox(false);
    //     } else {
    //         parentDiv.appendChild(childDiv_1);
    //         parentDiv.appendChild(childDiv_2);
    //         parentDiv.appendChild(childDiv_3);
    //         targetDiv_1.appendChild(parentDiv);
    //         setNestedBox(true);
    //     }
    //
    //     setNestedId(selectNestedId);
    // }

    const renderLink = ({ attributes, content }) => {
        const { href } = attributes;

        setImageModalUrl(href);

        return <Link onClick={() => setImageModal(true)} style={{textDecoration: 'none'}}>{content}</Link>;
    };

    return (
        <div>
            <AppBarNavigation />

            <div className="detail-main">
                <div className="detail-header1">
                    <span className="detail-title">{boardDetail.boardTitle}</span>
                    { `${boardDetail.boardTab}` === 'T1' && <span className="detail-date">화제</span> }
                    { `${boardDetail.boardTab}` === 'T2' && <span className="detail-date">정보</span> }
                    { `${boardDetail.boardTab}` === 'T3' && <span className="detail-date">오류</span> }
                    { `${boardDetail.boardTab}` === 'T4' && <span className="detail-date">사진/동영상</span> }
                    { `${boardDetail.boardTab}` === 'T5' && <span className="detail-date">팁과 노하우</span> }
                </div>
                <div className="detail-header2">
                    <span className="detail-author">{boardDetail.boardAuthor}</span>
                    <span className="detail-views">조회 수 {boardDetail.boardViewsCnt}</span>
                    <span className="detail-recommend">추천 수 {boardDetail.boardRecommendUpCnt - boardDetail.boardRecommendDownCnt}</span>
                    <span className="detail-comment">댓글 {totalComments}</span>
                </div>
                <div className="detail-body">
                    <div className="detail-url">
                        <Link to={locationURL} style={{textDecoration: 'none', color: 'gray', fontSize: '15px'}}>{locationURL}</Link>
                        <button onClick={() => copyClipBoardHandler(`${locationURL}`)}>복사</button>
                    </div>
                    <div className="detail-content">
                        {boardDetail.boardContent}
                    </div>
                </div>
                <div className="detail-footer1">
                    <div className="detail-mainRecommend">
                        <span className="detail-recommendUp">
                            {
                                // eslint-disable-next-line eqeqeq
                                `${boardDetail.boardRecommendUpCheck}` == 1 ?
                                    <FontAwesomeIcon icon={recommendUp} onClick={(e) => onClickMainRecommendUp(`${boardDetail.boardRecommendUpCheck}`)} className="recommendUp-btn" />
                                    :
                                    <FontAwesomeIcon icon={recommendUpCancel} onClick={(e) => onClickMainRecommendUp(`${boardDetail.boardRecommendUpCheck}`)} className="recommendUp-btn" />
                            }
                        </span>
                        <span className="detail-recommendDown">
                            {
                                // eslint-disable-next-line eqeqeq
                                `${boardDetail.boardRecommendDownCheck}` == 1 ?
                                    <FontAwesomeIcon icon={recommendDown} onClick={(e) => onClickMainRecommendDown(`${boardDetail.boardRecommendDownCheck}`)} className="recommendDown-btn" />
                                    :
                                    <FontAwesomeIcon icon={recommendDownCancel} onClick={(e) => onClickMainRecommendDown(`${boardDetail.boardRecommendDownCheck}`)} className="recommendDown-btn" />
                            }
                        </span>
                    </div>
                    {
                        // eslint-disable-next-line eqeqeq
                        `${boardDetail.boardAuthorId}` == `${boardDetail.loginMemberId}` ?
                            <div className="detail-modify">
                                <button className="detail-update-btn">
                                    <Link to="/save" state={{subTab_name, category_name, boardDetail}} style={{textDecoration: 'none', color: 'white'}}>
                                        수정
                                    </Link>
                                </button>
                                <button onClick={detailDeleteHandler} className="detail-delete-btn">
                                    삭제
                                </button>
                            </div>
                            :
                            null
                    }

                </div>
                <div className="detail-footer2">
                    <span className="detail-prev">
                        {
                            // eslint-disable-next-line eqeqeq
                            `${prevId}` != 'null' ?
                                <button>
                                    <Link to={{ pathname: `/board/${prevId}` }} style={{textDecoration: 'none', color: 'white'}} onClick={() => changeDetailBoard(props.boardId, 'prev')}>
                                        <div className="front">
                                            이전 글
                                        </div>
                                        <div className="back">
                                            <FontAwesomeIcon icon={leftArrow} style={{color: "white"}}/>
                                        </div>
                                    </Link>
                                </button>
                                :
                                null
                        }
                    </span>
                    <span className="detail-home">
                        <button>
                            <Link to="/board" style={{textDecoration: 'none', color: 'white'}} onClick={() => changeDetailBoard(null, null)}>
                                <div className="front">
                                    목록으로
                                </div>
                                <div className="back">
                                    <FontAwesomeIcon icon={buttonHouse} style={{color: "white"}}/>
                                </div>
                            </Link>
                        </button>
                    </span>
                    <span className="detail-next">
                        {
                            // eslint-disable-next-line eqeqeq
                            `${nextId}` != 'null' ?
                                <button>
                                    <Link to={{ pathname: `/board/${nextId}` }} style={{textDecoration: 'none', color: 'white'}} onClick={() => changeDetailBoard(props.boardId, 'next')}>
                                        <div className="front">
                                            다음 글
                                        </div>
                                        <div className="back">
                                            <FontAwesomeIcon icon={rightArrow} style={{color: "white"}}/>
                                        </div>
                                    </Link>
                                </button>
                                :
                                null
                        }
                    </span>
                </div>

                <div className="detail-sub">
                    <div className="comment-view">
                        <div className="comment-count">
                            댓글 {totalComments} 개
                        </div>
                        {commentList.map((comments) => (
                            // eslint-disable-next-line eqeqeq
                            <div className="comment-list" key={comments.commentId} id={comments.commentId} style={`${comments.commentNestedLevel}` == 1 ? {marginLeft: "40px"} : null }>
                                <div className="comment-header">
                                    <div className="comment-header1">
                                        {
                                            // eslint-disable-next-line eqeqeq
                                            `${comments.commentNestedLevel}` == 1 ? <FontAwesomeIcon icon={nestedArrow} style={{transform: "rotate(180deg)", marginRight: "8px", fontSize: "24px", color: "#6c757d"}}/> : null
                                        }
                                        <span className="comment-nickname">{comments.memberNickname}</span>
                                        <span className="comment-date">{comments.createdDate}</span>
                                    </div>
                                    <div className="comment-header2">
                                        <span className="comment-nested">
                                            <input type="hidden" value={comments.commentNestedId} />
                                            <input type="hidden" value={comments.commentNestedLevel} />
                                            {
                                                // eslint-disable-next-line eqeqeq
                                                `${isLoginCheck}` == 1 ?
                                                    // eslint-disable-next-line eqeqeq
                                                    `${comments.commentNestedLevel}` == 1 ? null :
                                                        <button className="comment-nested-btn" onClick={(e) =>
                                                            nestedActionHandler(nestedBox, e, `${comments.commentParentId}`,
                                                                `${comments.commentNestedId}`, `${comments.commentNestedLevel}`)} value={comments.commentId}>
                                                            댓글
                                                        </button>
                                                        :
                                                        null
                                            }
                                        </span>
                                        <span className="comment-recommendUp">
                                            {
                                                // eslint-disable-next-line eqeqeq
                                                `${comments.commentRecommendUpCheck}` == 1 ?
                                                    <label>
                                                        <input type="checkbox" style={{display: "none"}} defaultChecked={true} />
                                                        <FontAwesomeIcon icon={recommendUp} className="recommendUp-btn" onClick={(e) => onClickCommentRecommendUp(`${comments.commentId}`)}/>
                                                    </label>
                                                    :
                                                    <label>
                                                        <input type="checkbox" style={{display: "none"}} defaultChecked={false} />
                                                        <FontAwesomeIcon icon={recommendUpCancel} className="recommendUp-btn" onClick={(e) => onClickCommentRecommendUp(`${comments.commentId}`)}/>
                                                    </label>
                                            }
                                            <span className="comment-upCount"> {comments.commentRecommendUpCnt}</span>
                                        </span>
                                        <span className="comment-recommendDown">
                                            {
                                                // eslint-disable-next-line eqeqeq
                                                `${comments.commentRecommendDownCheck}` == 1 ?
                                                    <label>
                                                        <input type="checkbox" style={{display: "none"}} defaultChecked={true} />
                                                        <FontAwesomeIcon icon={recommendDown} className="recommendDown-btn" onClick={(e) => onClickCommentRecommendDown(`${comments.commentId}`)}/>
                                                    </label>
                                                    :
                                                    <label>
                                                        <input type="checkbox" style={{display: "none"}} defaultChecked={false} />
                                                        <FontAwesomeIcon icon={recommendDownCancel} className="recommendDown-btn" onClick={(e) => onClickCommentRecommendDown(`${comments.commentId}`)}/>
                                                    </label>
                                            }
                                            <span className="comment-downCount"> {comments.commentRecommendDownCnt}</span>
                                        </span>
                                        <span className="comment-delete">
                                            {
                                                // eslint-disable-next-line eqeqeq
                                                `${comments.memberId}` == `${commentLoginMemberId}` ?
                                                    <button onClick={() => commentDeleteHandler(`${comments.commentId}`)} className="comment-delete-btn">
                                                        삭제
                                                    </button>
                                                    :
                                                    null
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="comment-content font-list">
                                    <Linkify options={{ render: renderLink }}>
                                        {comments.commentContent}
                                    </Linkify>
                                    { imageModal ? <ImageModal setImageModal={setImageModal} imageUrl={imageModalUrl}/> : null }
                                </div>
                                <div className="nested-content"></div>
                                <div className="nested-div">
                                    <div className="nested-write">
                                        <div className="nested-tag">
                                            <div className="nested-header1">
                                                <FontAwesomeIcon icon={nestedArrow} style={{transform:"rotate(180deg)"}}/>
                                                <span style={{marginLeft: "4px"}}>댓글 달기</span>
                                            </div>
                                            <div className="nested-header2">
                                                <button className="nested-close" onClick={(e) => nestedActionHandler(true, e)} value={comments.commentId}>닫기</button>
                                            </div>
                                        </div>
                                        <div className="nested-box">
                                            <textarea id="nested-text" placeholder="댓글을 입력하세요" onChange={changeNestedTextHandler}/>
                                        </div>
                                        <div className="nested-btn">
                                            <button className="btn-design" onClick={(e) => nestedSaveHandler(e)} value={comments.commentId}>등록</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="comment-paging">
                            <ul>
                                {pagination()}
                            </ul>
                        </div>
                    </div>
                    <div className="comment-write">
                        <div className="comment-tag">댓글 작성</div>
                        <div className="comment-box" style={ isLoginCheck ? {} : {} }>
                            {
                                // eslint-disable-next-line eqeqeq
                                `${isLoginCheck}` == 1 ?
                                    <textarea id="comment-text" placeholder="댓글을 입력하세요" onChange={changeCommentTextHandler}/>
                                    :
                                    <textarea id="comment-text" placeholder="댓글을 작성하시려면 로그인 해주세요." readOnly/>
                            }
                        </div>
                        <div className="comment-btn" style={ isLoginCheck ? {} : {} }>
                            {
                                // eslint-disable-next-line eqeqeq
                                `${isLoginCheck}` == 1 ?
                                    <button className="btn-design" onClick={commentSaveHandler}>등록</button>
                                    :
                                    <button className="btn-design" onClick={() => alert('로그인 하시길 바랍니다.')}>등록</button>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BoardDetail;