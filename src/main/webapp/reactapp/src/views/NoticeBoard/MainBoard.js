import AppBarNavigation from "../Navigation/AppBarNavigation";
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import Game1Board from "./Game1Board";
import Game2Board from "./Game2Board";
import Game3Board from "./Game3Board";
import Game4Board from "./Game4Board";
import Game5Board from "./Game5Board";
import Game6Board from "./Game6Board";
import {useState} from "react";

const MainBoard = () => {

    const [currentTab, clickTab] = useState(0);
    const tab_data = [
        {
            id: 1,
            view: <Game1Board />
        },
        {
            id: 2,
            view: <Game2Board />
        },
        {
            id: 3,
            view: <Game3Board />
        },
        {
            id: 4,
            view: <Game4Board />
        },
        {
            id: 5,
            view: <Game5Board />
        },
        {
            id: 6,
            view: <Game6Board />
        },
    ]

    const selectTabHandler = (index) => {
        clickTab(index);
    }

    return (
        <div style={{position: 'relative'}}>
            <AppBarNavigation />
            <ul>
                {tab_data.map((el,index) => (
                    <li onClick={() => selectTabHandler(index)}>{el.id}</li>
                ))}
            </ul>

            {tab_data[currentTab].view}

        </div>
    )
}

export default MainBoard;