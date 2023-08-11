import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss';
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from "@fortawesome/free-brands-svg-icons";
import axios from "axios";
const DetailBoard = () => {

    const params = useParams();

    const [game1BoardDetail, setGame1BoardDetail] = useState("");

    useEffect(() => {
        const getBoards = async () => {
            const detail = await axios({
                method: "GET",
                url: '/detailBoard/' + params.boardNo
            });
            setGame1BoardDetail(detail.data);
        };

        getBoards();
        console.log(game1BoardDetail);
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