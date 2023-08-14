import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss';
import React, {useEffect, useRef, useState} from "react";
import {Link, useParams, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import {Viewer} from "@toast-ui/react-editor";

const DetailBoard = (props) => {
    const location = useLocation();
    const params = useParams();
    const editorRef = useRef(null);

    const [boardDetail, setBoardDetail] = useState("");

    useEffect(() => {

        const boardId = location.state?.boardId;

        if(boardId != null) {
            const getBoards = async () => {
                const detail = await axios({
                    method: "GET",
                    url: '/detailBoard/' + boardId
                });
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
                });
                setBoardDetail(detail.data);
                editorRef.current.getInstance().setMarkdown(detail.data.boardContent);
            };

            console.log(locationParameter.substring(7));
            getBoards();
        }


        console.log(location.state);
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
                    <span className="detail-recommend"></span>
                    <span className="detail-comment"></span>
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
                    추천
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