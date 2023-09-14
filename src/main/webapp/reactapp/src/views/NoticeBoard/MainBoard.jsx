import AppBarNavigation from "../Navigation/AppBarNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import './MainBoard.scss';
import '../Layouts/MainView.scss'
import TableBoard from "./TableBoard";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import DetailBoard from "./DetailBoard";

const MainBoard = () => {
    const props = useLocation().state?.mainReset;
    const locationParameter = window.location.pathname;

    const category_name = [
        {
            key: "C0",
            value: '전체'
        },
        {
            key: "C1",
            value: '리그오브레전드'
        },
        {
            key: "C2",
            value: '오버워치'
        },
        {
            key: "C3",
            value: '배틀그라운드'
        },
        {
            key: "C4",
            value: '메이플스토리'
        },
        {
            key: "C5",
            value: '마인크래프트'
        },
        {
            key: "C6",
            value: '스팀'
        },
        ];
    const [currentTab, clickTab] = useState(0);

    const [detailBoardId, setDetailBoardId] = useState(null);
    const changeDetailBoardId = (changeBoardId) => {
        setDetailBoardId(changeBoardId);
    }

    const changeTabHandler = () => {
        let tab_data = [];
        for(let i=0; i<category_name.length; i++) {
            tab_data.push({id: i, name: category_name[i].value, view:<TableBoard id={i} sey={category_name[i].key} value={category_name[i].value} category={category_name} changeBoardId={changeDetailBoardId}/>});
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