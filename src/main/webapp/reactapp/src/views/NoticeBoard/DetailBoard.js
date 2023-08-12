import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss';
import React, {useEffect, useState} from "react";
import {Link, useParams, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
const DetailBoard = (props) => {
    const location = useLocation();
    const params = useParams();

    const [game1BoardDetail, setGame1BoardDetail] = useState("");

    useEffect(() => {
        const getBoards = async () => {
            const detail = await axios({
                method: "GET",
                url: '/detailBoard/' + props.id
            });
            setGame1BoardDetail(detail.data);
        };

        getBoards();
    }, []);


    return (
        <div>
            <AppBarNavigation />
            <h2>게시글 상세정보</h2>
            <div>
                {game1BoardDetail.boardContent}
                {game1BoardDetail.boardNo}
            </div>
        </div>
    )
}

export default DetailBoard;