import AppBarNavigation from "../Navigation/HeaderNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import './BoardMain.scss';
import '../Layouts/MainView.scss'
import BoardTable from "./BoardTable";
import React, {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import BoardDetail from "./BoardDetail";

const BoardMain = () => {
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
        }
        ];

    const subTab_name = [
        {
            key: 'T0',
            value: '전체'
        },
        {
            key: 'T1',
            value: '화제'
        },
        {
            key: 'T2',
            value: '정보'
        },
        {
            key: 'T3',
            value: '오류'
        },
        {
            key: 'T4',
            value: '사진/동영상'
        },
        {
            key: 'T5',
            value: '팁과 노하우'
        }
        ];

    const [currentTab, clickTab] = useState(0);

    const [detailBoardId, setDetailBoardId] = useState(null);
    const [detailBoardAuthorId, setDetailBoardAuthorId] = useState(null);

    const changeTabHandler = () => {
        let tab_data = [];
        for(let i=0; i<category_name.length; i++) {
            tab_data.push({id: i, name: category_name[i].value,
                view:<BoardTable keys={category_name[i].key} value={category_name[i].value}
                                 category={category_name} subTab={subTab_name}
                                 changeBoardId={setDetailBoardId} changeBoardAuthorId={setDetailBoardAuthorId}/>});
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
                detailBoardId === null ?
                    changeTabHandler()[currentTab].view
                    :
                    <BoardDetail boardId={detailBoardId} authorId={detailBoardAuthorId} changeBoardId={setDetailBoardId}
                                 category={category_name} subTab={subTab_name} />
            }

            <FooterNavigation />
        </div>
    )
}

export default BoardMain;