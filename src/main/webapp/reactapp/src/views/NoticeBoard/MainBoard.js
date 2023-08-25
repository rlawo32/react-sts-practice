import AppBarNavigation from "../Navigation/AppBarNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss'
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import TableBoard from "./TableBoard";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from "@fortawesome/free-brands-svg-icons";
import DetailBoard from "./DetailBoard";
import axios from "axios";

const MainBoard = () => {
    const props = useLocation().state?.mainReset;
    const locationParameter = window.location.pathname;

    const tab_name = ['리그오브레전드', '오버워치', '배틀그라운드', '메이플스토리', '마인크래프트', '스팀'];
    const [currentTab, clickTab] = useState(0);

    const [detailBoardId, setDetailBoardId] = useState(null);
    const changeDetailBoardId = (changeBoardId) => {
        setDetailBoardId(changeBoardId);
    }

    const changeTabHandler = () => {
        let tab_data = [];
        for(let i=0; i<tab_name.length; i++) {
            tab_data.push({id: i, name: tab_name[i], view:<TableBoard id={i} name={tab_name[i]} changeBoardId={changeDetailBoardId}/>});
        }
        return tab_data;
    }

    const selectTabHandler = (idx) => {
        clickTab(idx);
        setDetailBoardId(null);
    }

    useEffect(() => {
        if(locationParameter.length > 6) {
            setDetailBoardId(locationParameter.substring(7));
        } else {
            setDetailBoardId(null);
        }

        if(props === null) {
            setDetailBoardId(props)
        }

        console.log("부모 props 확인 : " + detailBoardId);
        console.log(changeTabHandler());
        console.log(props);
    }, [props, locationParameter]);

    return (
        <div className="main_board">

            <AppBarNavigation />
            <div className="main_tab">
                <ul>
                    {changeTabHandler().map((el) => (
                        <li key={el.id} onClick={() => selectTabHandler(el.id)}>
                            <Link to="/board" style={{ color: "white", textDecoration: "none"}}>{el.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            {
                detailBoardId === null ? changeTabHandler()[currentTab].view : <DetailBoard id={detailBoardId} changeBoardId={changeDetailBoardId}/>
            }

            <FooterNavigation />
        </div>
    )
}

export default MainBoard;