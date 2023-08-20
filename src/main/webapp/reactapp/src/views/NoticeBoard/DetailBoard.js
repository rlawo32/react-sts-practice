import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss';
import React, {useEffect, useRef, useState} from "react";
import {Link, useParams, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsUp as recommendUp} from "@fortawesome/free-solid-svg-icons";
import {faThumbsUp as recommendDown} from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import {Viewer} from "@toast-ui/react-editor";
import Button from "@mui/material/Button";

const DetailBoard = (props) => {
    const location = useLocation();
    const locationURL = window.location.href;
    const params = useParams();
    const editorRef = useRef(null);

    const [boardDetail, setBoardDetail] = useState("");
    const [boardId, setBoardId] = useState(props.id);
    const [prevId, setPrevId] = useState(0);
    const [nextId, setNextId] = useState(0);
    const [memberId, setMemberId] = useState(9999);
    const [recommendCheck, setRecommendCheck] = useState(false);

    const recommendData = {
        memberId: `${memberId}`,
        boardId: props.id
    }

    const copyClipBoardHandler = (text) => {
        navigator.clipboard.writeText(text);

        alert('복사 성공 \n' + text);
    }

    const onClickRecommend = async () => {
        if(recommendCheck) {
            await axios({
                method: "DELETE",
                url: '/recommendDown',
                data: JSON.stringify(recommendData),
                headers: {'Content-type': 'application/json'}
            });
            setRecommendCheck(false);
        } else {
            await axios({
                method: "POST",
                url: '/recommendUp',
                data: JSON.stringify(recommendData),
                headers: {'Content-type': 'application/json'}
            });
            setRecommendCheck(true);
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

                setRecommendCheck(recommends.data);
                setPrevId(selectBoard.data.boardIdPrev);
                setNextId(selectBoard.data.boardIdNext);
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

                setRecommendCheck(recommends.data);
                setPrevId(selectBoard.data.boardIdPrev);
                setNextId(selectBoard.data.boardIdNext);
            };

            getBoards();
        }
    }, [prevId, nextId, recommendCheck, props.id])

    useEffect(() => {
        if(boardId != null) {
            const getBoards = async () => {
                const detail = await axios({
                    method: "GET",
                    url: '/detailBoard/' + props.id
                })

                setBoardDetail(detail.data);
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
                    <Button onClick={onClickRecommend}>
                        {
                            recommendCheck ? <FontAwesomeIcon icon={recommendUp} /> : <FontAwesomeIcon icon={recommendDown} />
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
            </div>
            <div className="detail-sub">
                댓글
            </div>
        </>
    )
}

export default DetailBoard;