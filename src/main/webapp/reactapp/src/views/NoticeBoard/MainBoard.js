import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import Game1Board from "./Game1Board";
import Game2Board from "./Game2Board";
import Game3Board from "./Game3Board";
import Game4Board from "./Game4Board";
import Game5Board from "./Game5Board";
import Game6Board from "./Game6Board";
import {useState} from "react";

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
        <div style={{position: 'relative'}}>
            <AppBarNavigation />
            <ul className="main_tab">
                {tab_data.map((el) => (
                    <li key={el.id} onClick={() => selectTabHandler(el.id)}>{el.name[el.id]}</li>
                ))}
            </ul>

            {tab_data[currentTab].view}

            {/*<Game1Board />*/}
        </div>
    )
}

export default MainBoard;