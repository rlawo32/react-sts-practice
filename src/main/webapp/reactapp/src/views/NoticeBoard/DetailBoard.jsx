import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss';
import React, {useEffect, useRef, useState} from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {createRoot} from "react-dom/client";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp as recommendUp, faThumbsDown as recommendDown, faReply as nestedArrow} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as recommendUpCancel, faThumbsDown as recommendDownCancel} from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import {Viewer} from "@toast-ui/react-editor";
import Button from "@mui/material/Button";

const DetailBoard = (props) => {
    const locationURL = window.location.href;
    const editorRef = useRef(null);

    const [boardDetail, setBoardDetail] = useState("");
    const [prevId, setPrevId] = useState(0);
    const [nextId, setNextId] = useState(0);
    const [memberId, setMemberId] = useState(9999);
    const [mainRecommendUpCheck, setMainRecommendUpCheck] = useState(false);
    const [mainRecommendDownCheck, setMainRecommendDownCheck] = useState(false);

    const [commentRecommendUpCheck, setCommentRecommendUpCheck] = useState(false);
    const [commentRecommendDownCheck, setCommentRecommendDownCheck] = useState(false);

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
        commentId: '',
        commentNestedId: '',
        commentNestedLevel: '',
        commentContent: '',
        boardId: '',
        memberId: '',
        memberNickname: '',
        createdDate: '',
        modifiedDate: ''
    }]);

    const paging = {
        boardId: props.id,
        recordPerPage: 10,
        page: pageNo
    }

    const recommendData = {
        memberId: `${memberId}`,
        boardId: props.id
    }

    const commentData = {
        commentParentId: "",
        commentTargetId: "",
        commentNestedId: "",
        commentNestedLevel: "",
        memberId: 9999,
        boardId: props.id,
        commentContent: commentText
    }

    const nestedData = {
        commentParentId: commentParentId,
        commentTargetId: commentTargetId,
        commentNestedId: nestedId,
        commentNestedLevel: nestedLevel,
        memberId: 9999,
        boardId: props.id,
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

    const onClickMainRecommend = async () => {
        if(mainRecommendUpCheck) {
            await axios({
                method: "DELETE",
                url: '/recommendDown',
                data: JSON.stringify(recommendData),
                headers: {'Content-type': 'application/json'}
            });
            setMainRecommendUpCheck(false);
        } else {
            await axios({
                method: "POST",
                url: '/recommendUp',
                data: JSON.stringify(recommendData),
                headers: {'Content-type': 'application/json'}
            });
            setMainRecommendUpCheck(true);
        }
    }

    const onClickCommentRecommend = async () => {
        if(commentRecommendUpCheck) {
            setCommentRecommendUpCheck(false);
        } else {
            setCommentRecommendUpCheck(true);
        }
    }

    const changeDetailBoard = async (itemID, orderID) => {

        if(itemID != null) {
            await axios({
                method: "GET",
                url: '/boardPrevAndNext',
                params: {boardId: itemID, orderId: orderID}
            })
            if(orderID == 'prev') {
                props.changeBoardId(prevId);
            } else {
                props.changeBoardId(nextId);
            }
        } else {
            props.changeBoardId(itemID);
        }
    }

    useEffect(() => {
        if(props.id != null) {
            const getBoards = async () => {

                const recommends = await axios({
                    method: "GET",
                    url: '/recommendCheck',
                    params: recommendData
                })

                const selectBoard = await axios({
                    method: "GET",
                    url: '/boardPrevAndNextSelect',
                    params: {boardId: props.id}
                })

                const boardComments = await axios({
                    method: "GET",
                    url: '/commentList',
                    params: paging
                })
                console.log(boardComments.data.commentList);

                setMainRecommendUpCheck(recommends.data);
                setPrevId(selectBoard.data.boardIdPrev);
                setNextId(selectBoard.data.boardIdNext);
                setCommentList(boardComments.data.commentList);
                setTotalPage(boardComments.data.totalPage);
                setTotalComments(boardComments.data.totalComments);
            };

            getBoards();
        } else {
            const locationParameter = window.location.pathname;

            const getBoards = async () => {

                const recommends = await axios({
                    method: "GET",
                    url: '/checkRecommend',
                    params: recommendData
                })

                const selectBoard = await axios({
                    method: "GET",
                    url: '/boardPrevAndNextSelect',
                    params: {boardId: locationParameter.substring(7)}
                })

                const comments = await axios({
                    method: "GET",
                    url: '/commentList',
                    params: paging
                })

                setMainRecommendUpCheck(recommends.data);
                setPrevId(selectBoard.data.boardIdPrev);
                setNextId(selectBoard.data.boardIdNext);
                setCommentList(comments.data.commentList);
                setTotalPage(comments.data.totalPage);
                setTotalComments(comments.data.totalComments);
            };

            getBoards();
        }
    }, [prevId, nextId, mainRecommendUpCheck, props.id, pageNo, commentText])
    // prevId:이전글, nextId:다음글, mainRecommendCheck:추천체크, props.id:게시판에서 선택한 게시글 id,
    // pageNo:댓글 페이지 이동, commentText: 댓글 작성 후 바로 추가, nestedId:대댓글을 작성할 댓글 id

    useEffect(() => {
        if(props.id != null) {
            const getBoards = async () => {
                const detail = await axios({
                    method: "GET",
                    url: '/detailBoard/' + props.id
                })

                setBoardDetail(detail.data);
                // setCommentList(detail.data.boardComments);
                editorRef.current.getInstance().setMarkdown(detail.data.boardContent);
            };

            getBoards();
        } else {
            const locationParameter = window.location.pathname;

            const getBoards = async () => {
                const detail = await axios({
                    method: "GET",
                    url: '/detailBoard/' + locationParameter.substring(7)
                })

                setBoardDetail(detail.data);
                editorRef.current.getInstance().setMarkdown(detail.data.boardContent);
            };

            getBoards();
        }
    }, [props.id]);
    // props.id:url 직접 입력 시를 위함 (세부적인 기능 체크 필요)

    const changeCommentHandler = ({target: {value}}) => {
        setCommentText(value);
    }

    const changeNestedHandler = ({target: {value}}) => {
        setNestedText(value);
    }

    const commentSaveHandler = async () => {
        if(commentText == "") {
            alert("내용을 입력해주세요");
        } else {
            await axios({
                method: "POST",
                url: '/commentSave',
                data: JSON.stringify(commentData),
                headers: {'Content-type': 'application/json'}
            }).then(() => {
                setCommentText("");
                document.getElementById("comment-text").value='';
                // window.location.reload();
            })
        }
    }

    const nestedSaveHandler = async () => {
        if(nestedText == "") {
            alert("내용을 입력해주세요");
        } else {
            await axios({
                method: "POST",
                url: '/commentSave',
                data: JSON.stringify(nestedData),
                headers: {'Content-type': 'application/json'}
            }).then(() => {
                setNestedText("");
                document.getElementById("nested-text").value='';
                // window.location.reload();
            })
            console.log(nestedData);
        }
    }

    const nestedTestHandler = (box, e, parent_id, nested_id, nested_level) => {
        const selectCommentId = e.target.value;

        setCommentParentId(parent_id);
        setCommentTargetId(selectCommentId);
        setNestedId(nested_id);
        setNestedLevel(nested_level);

        const targetDiv_1 = document.getElementById(selectCommentId);
        //
        // const removeDiv = document.querySelector(".nested-write");
        //
        // const targetDiv_1 = createRoot(targetDiv_Id);
        //
        // const parentDiv = React.createElement("div", {className: "nested-write"});
        // const childDiv_1 = React.createElement("div", {className: "nested-tag"});
        //
        // if(box) {
        //     targetDiv_1.unmount();
        //     setNestedBox(false);
        // } else {
        //     targetDiv_1.render(parentDiv);
        //     setNestedBox(true);
        // }

        if(commentId != selectCommentId) {
            box = false;
            const targetDiv_2 = document.getElementById(commentId);
            if(targetDiv_2) {
                targetDiv_2.style.display = "none";
            }
        }

        if(box) {
            targetDiv_1.style.display = "none";
            setNestedBox(false);
        } else {
            targetDiv_1.style.display = "block";
            setNestedBox(true);
        }

        setCommentId(selectCommentId);
    }

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

    return (
        <>
            <AppBarNavigation />
            <div className="detail-main">
                <div className="detail-header1">
                    <span className="detail-title">{boardDetail.boardTitle}</span>
                    <span className="detail-date">{boardDetail.boardTab}</span>
                </div>
                <div className="detail-header2">
                    <span className="detail-author">{boardDetail.boardAuthor}</span>
                    <span className="detail-comment"></span>
                    <span className="detail-views">조회 수 {boardDetail.boardViewsCnt}</span>
                    <span className="detail-recommend">추천 수 {boardDetail.boardRecommendCnt}</span>
                </div>
                <div className="detail-body">
                    <div className="detail-url">
                        <Link to={locationURL} style={{textDecoration: 'none', color: 'gray', fontSize: '15px'}}>{locationURL}</Link>
                        <Button onClick={() => copyClipBoardHandler(`${locationURL}`)}>복사</Button>
                    </div>
                    <div className="detail-content">
                        <Viewer
                            ref={editorRef}
                            theme="dark"
                            initialValue={boardDetail.boardContent}
                        />
                    </div>
                </div>
                <div className="detail-footer1">
                    <Button onClick={onClickMainRecommend}>
                        {
                            mainRecommendUpCheck ? <FontAwesomeIcon icon={recommendUp} /> : <FontAwesomeIcon icon={recommendUpCancel} />
                        }
                    </Button>
                </div>
                <div className="detail-footer2">
                    {
                        prevId != null ?
                            <span>
                                <Link to={{ pathname: `/board/${prevId}` }} style={{textDecoration: 'none', color: 'white'}} onClick={() => changeDetailBoard(props.id, 'prev')}>이전 글 -- </Link>
                            </span> :
                            <span>

                            </span>
                    }
                    <span>
                        <Link to="/board" style={{textDecoration: 'none', color: 'white'}} onClick={() => changeDetailBoard(null, null)}>목록으로</Link>
                    </span>
                    {
                        nextId != null ?
                            <span>
                                <Link to={{ pathname: `/board/${nextId}` }} style={{textDecoration: 'none', color: 'white'}} onClick={() => changeDetailBoard(props.id, 'next')}> -- 다음 글</Link>
                            </span> :
                            <span>

                            </span>
                    }
                </div>

                <div className="detail-sub">
                    <div className="comment-view">
                        <div className="comment-count">
                            댓글 {totalComments} 개
                        </div>
                        {commentList.map((comments) => (
                            <div className="comment-list" key={comments.commentId}>
                                <div className="comment-header">
                                    <div className="comment-header1">
                                        <span className="comment-nickname">{comments.memberNickname}</span>
                                        <span className="comment-date">{comments.createdDate}</span>
                                    </div>
                                    <div className="comment-header2">
                                        <span className="comment-recommendUp">
                                            <button onClick={onClickCommentRecommend} className="recommendUp-btn">
                                                {
                                                    commentRecommendUpCheck ? <FontAwesomeIcon icon={recommendUp} /> : <FontAwesomeIcon icon={recommendUpCancel} />
                                                }
                                            </button>
                                            <span className="comment-upCount"></span>
                                        </span>
                                        <span className="comment-recommendDown">
                                            <button onClick={onClickCommentRecommend} className="recommendDown-btn">
                                                {
                                                    commentRecommendDownCheck ? <FontAwesomeIcon icon={recommendDown} /> : <FontAwesomeIcon icon={recommendDownCancel} />
                                                }
                                            </button>
                                            <span className="comment-downCount"></span>
                                        </span>
                                        <span className="comment-nested">
                                            <input type="hidden" value={comments.commentNestedId} />
                                            <input type="hidden" value={comments.commentNestedLevel} />
                                            <button className="comment-nested-btn" onClick={(e) => nestedTestHandler(nestedBox, e, `${comments.commentParentId}`, `${comments.commentNestedId}`, `${comments.commentNestedLevel}`)} value={comments.commentId}>
                                                댓글
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div className="comment-content">{comments.commentContent}</div>
                                <div className="nested-content"></div>
                                <div className="nested-div" id={comments.commentId}>
                                    <div className="nested-write">
                                        <div className="nested-tag">
                                            <div className="nested-header1">
                                                <FontAwesomeIcon icon={nestedArrow} style={{transform:"rotate(180deg)"}}/>
                                                <span style={{marginLeft: "4px"}}>댓글 달기</span>
                                            </div>
                                            <div className="nested-header2">
                                                <button className="nested-close" onClick={(e) => nestedTestHandler(true, e)} value={comments.commentId}>닫기</button>
                                            </div>
                                        </div>
                                        <div className="nested-box">
                                            <textarea id="nested-text" placeholder="댓글을 입력하세요" onChange={changeNestedHandler}/>
                                        </div>
                                        <div className="nested-btn">
                                            <button className="btn-design" onClick={nestedSaveHandler}>등록</button>
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
                        <div className="comment-box">
                            <textarea id="comment-text" placeholder="댓글을 입력하세요" onChange={changeCommentHandler}/>
                        </div>
                        <div className="comment-btn" >
                            <button className="btn-design" onClick={commentSaveHandler}>등록</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailBoard;