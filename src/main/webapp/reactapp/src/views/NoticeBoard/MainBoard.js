import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss'
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import Game1Board from "./Game1Board";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from "@fortawesome/free-brands-svg-icons";
import DetailBoard from "./DetailBoard";
import axios from "axios";

const MainBoard = () => {
    const location = useLocation();
    const mainReset = location.state?.mainReset;

    const tab_name = ['리그오브레전드', '오버워치', '배틀그라운드', '메이플스토리', '마인크래프트', '스팀'];
    const [currentTab, clickTab] = useState(0);

    const [detailBoardNo, setDetailBoardNo] = useState(null);
    const changeDetailBoardNo = (newNo) => {
        setDetailBoardNo(newNo);
    }

    const changeTabHandler = () => {
        let tab_data = [];
        for(let i=0; i<tab_name.length; i++) {
            tab_data.push({id: i, name: tab_name[i], view:<Game1Board id={i} name={tab_name[i]} boardNo={changeDetailBoardNo}/>});
        }
        return tab_data;
    }

    const selectTabHandler = (idx) => {
        clickTab(idx);
        setDetailBoardNo(null);
    }

    useEffect(() => {
        setDetailBoardNo(mainReset);
    }, [mainReset]);

    return (
        <div className="main_board">

            <AppBarNavigation />
            <div className="main_tab">
                <ul>
                    {changeTabHandler().map((el) => (
                        <li key={el.id} onClick={() => selectTabHandler(el.id)}>{el.name}</li>
                    ))}
                </ul>
            </div>

            {
                detailBoardNo === null ? changeTabHandler()[currentTab].view : <DetailBoard id={detailBoardNo}/>
            }

            {/*{changeTabHandler()[currentTab].view}*/}

            <div className="Social-logo">
                <div style={ {borderBottom: "1px inset white", marginBottom: "50px", width: "60%", marginLeft: "auto", marginRight: "auto"} } />
                <Link to="https://github.com/" style={ {color: "white" ,marginRight: "200px"} }>
                    <FontAwesomeIcon className="link-style" icon={faGithubSquare} />
                </Link>
                <Link to="https://www.youtube.com/" style={ {color: "white"} }>
                    <FontAwesomeIcon className="link-style" icon={faYoutubeSquare} />
                </Link>
            </div>
        </div>
    )
}

export default MainBoard;