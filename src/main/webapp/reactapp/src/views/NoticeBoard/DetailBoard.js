import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss';
import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp as recommendUp, faThumbsDown as recommendDown} from "@fortawesome/free-solid-svg-icons";
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

    const [nestedId, setNestedId] = useState("");
    const [nestedBox, setNestedBox] = useState(false);
    const [nestedText, setNestedText] = useState("");

    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [commentList, setCommentList] = useState([{
        commentId: '',
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
    }, [prevId, nextId, mainRecommendUpCheck, props.id, pageNo, nestedId])
    // prevId:이전글, nextId:다음글, recommendCheck:추천체크, props.id:게시판에서 선택한 게시글 id

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
    }, [props.id, commentText]);

    const changeCommentHandler = ({target: {value}}) => {
        setCommentText(value);
    }

    const commentData = {
        memberId: 9999,
        boardId: props.id,
        commentContent: commentText
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
                document.getElementById("textarea").value='';
                // window.location.reload();
            })
        }
    }

    const nestedSaveHandler = (box, e) => {
        const selectNestedId = e.target.value;


        setNestedId(selectNestedId);

        console.log("값 확인 1 : " + selectNestedId);
        console.log("값 확인 2 : " + nestedId);

        if(nestedId != selectNestedId) {
            const parentDiv = document.getElementById(nestedId);
            const childDiv = document.createElement("div");

            if(box) {
                const removeDiv = document.querySelector(".nested-write");
                parentDiv.removeChild(removeDiv);
                setNestedBox(false);
            } else {
                childDiv.innerHTML = "(current)";
                childDiv.classList.add("nested-write");
                parentDiv.appendChild(childDiv);
                setNestedBox(true);
            }
        } else {

        }

        console.log("댓글 키 값 확인 1 : " + e.target.value);
        console.log("댓글 키 값 확인 2 : " + box);






        // setNestedBox(true);


    }

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
                            <div className="comment-list" key={comments.commentId} id={comments.commentId}>
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
                                            <span className="comment-upCount">1</span>
                                        </span>
                                            <span className="comment-recommendDown">
                                            <button onClick={onClickCommentRecommend} className="recommendDown-btn">
                                                {
                                                    commentRecommendDownCheck ? <FontAwesomeIcon icon={recommendDown} /> : <FontAwesomeIcon icon={recommendDownCancel} />
                                                }
                                            </button>
                                            <span className="comment-downCount">1</span>
                                        </span>
                                            <span className="comment-nested">
                                            <button className="nested-btn" onClick={(e) => nestedSaveHandler(nestedBox, e)} value={comments.commentId}>
                                                댓글
                                            </button>
                                        </span>
                                    </div>
                                </div>
                                <div className="comment-content">{comments.commentContent}</div>
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
                            <textarea id="textarea" placeholder="댓글을 입력하세요" onChange={changeCommentHandler}/>
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