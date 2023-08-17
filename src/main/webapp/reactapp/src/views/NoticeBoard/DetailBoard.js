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
    const params = useParams();
    const editorRef = useRef(null);

    const [boardDetail, setBoardDetail] = useState("");
    const [memberId, setMemberId] = useState(9999);
    const [recommendCheck, setRecommendCheck] = useState(false);

    const recommendData = {
        memberId: `${memberId}`,
        boardId: props.id
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

    useEffect(() => {
        const boardId = location.state?.boardId;

        if(boardId != null) {
            const getBoards = async () => {
                const detail = await axios({
                    method: "GET",
                    url: '/detailBoard/' + boardId
                })

                const recommendCheck = await axios({
                    method: "GET",
                    url: '/recommendCheck',
                    params: recommendData
                })

                setBoardDetail(detail.data);
                setRecommendCheck(recommendCheck.data);
                console.log(detail.data);
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

                const recommendCheck = await axios({
                    method: "GET",
                    url: '/checkRecommend',
                    params: recommendData
                })

                setBoardDetail(detail.data);
                setRecommendCheck(recommendCheck.data);
                console.log(detail.data);
                editorRef.current.getInstance().setMarkdown(detail.data.boardContent);
            };

            getBoards();
        }
    }, []);

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
                    <span className="detail-views"></span>
                    <span className="detail-comment"></span>
                    <span className="detail-recommend">추천 수 {boardDetail.boardRecommendCnt}</span>
                </div>
                <div className="detail-body">
                    <div className="detail-url">현재주소저쩌구</div>
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
                    이전글 -- 목록으로 -- 다음글
                </div>
            </div>
            <div className="detail-sub">
                댓글
            </div>
        </>
    )
}

export default DetailBoard;