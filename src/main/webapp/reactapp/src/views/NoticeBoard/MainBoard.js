import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss'
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import Game1Board from "./Game1Board";
import Game2Board from "./Game2Board";
import Game3Board from "./Game3Board";
import Game4Board from "./Game4Board";
import Game5Board from "./Game5Board";
import Game6Board from "./Game6Board";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from "@fortawesome/free-brands-svg-icons";

const MainBoard = () => {

    const tab_name = ['리그오브레전드', '오버워치', '배틀그라운드', '메이플스토리', '마인크래프트', '스팀'];
    const [currentTab, clickTab] = useState(0);

    const tab_data = [
        {
            id: 0,
            name: tab_name,
            view: <Game1Board />
        },
        {
            id: 1,
            name: tab_name,
            view: <Game2Board />
        },
        {
            id: 2,
            name: tab_name,
            view: <Game3Board />
        },
        {
            id: 3,
            name: tab_name,
            view: <Game4Board />
        },
        {
            id: 4,
            name: tab_name,
            view: <Game5Board />
        },
        {
            id: 5,
            name: tab_name,
            view: <Game6Board />
        },
    ]

    const selectTabHandler = (idx) => {
        clickTab(idx);
    }

    return (
        <div className="main_board">
            <AppBarNavigation />
            <ul className="main_tab">
                {tab_data.map((el) => (
                    <li key={el.id} onClick={() => selectTabHandler(el.id)}>{el.name[el.id]}</li>
                ))}
            </ul>

            {tab_data[currentTab].view}

            {/*<Game1Board />*/}

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