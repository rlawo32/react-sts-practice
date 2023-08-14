import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AppBarNavigation from "../Navigation/AppBarNavigation";
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import './MainBoard.scss';

const Game1Board = (props) => {

    const subTab_name = ['전체', '화제', '정보', '오류', '사진/동영상', '팁과 노하우'];
    const [currentSubTab, clickSubTab] = useState(0);

    const selectSubTabHandler = (index) => {
        clickSubTab(index);
    }

    // const accessToken = new URL(window.location.href).searchParams.get("accessToken");
    // const refreshToken = new URL(window.location.href).searchParams.get("refreshToken");
    //
    // if (accessToken) {
    //     localStorage.setItem("accessToken", accessToken);
    //     localStorage.setItem("refreshToken", refreshToken);
    // }

    const [game1BoardList, setGame1BoardList] = useState([{
        boardNo: '',
        boardTab: '',
        boardTitle: '',
        boardContent: '',
        boardAuthor: '',
        modifiedDate: ''
    }]);

    useEffect(() => {
        const getBoards = async () => {
            const game1Board = await axios({
                method: "GET",
                url: '/game1BoardList'
            });
            setGame1BoardList(game1Board.data.game1BoardList);
        };

        getBoards();
    }, []);

    const changeDetailBoard = (itemID) => {
        const detailBoardNo = itemID;
        props.boardNo(detailBoardNo);
    }

    const [currentTab, clickTab] = useState(0);

    const subTab_data = [
        {
            id: 0,
            name: subTab_name,
            view: ""
        },
        {
            id: 1,
            name: subTab_name,
            view: ""
        },
        {
            id: 2,
            name: subTab_name,
            view: ""
        },
        {
            id: 3,
            name: subTab_name,
            view: ""
        },
        {
            id: 4,
            name: subTab_name,
            view: ""
        },
        {
            id: 5,
            name: subTab_name,
            view: ""
        },
    ]

    const selectTabHandler = (idx) => {
        clickTab(idx);
    }

    return (
        <>
            <AppBarNavigation />
            {/*<ul>*/}
            {/*    {subTab_name.map((elo) => (*/}
            {/*        <li key={elo.id} onClick={() => selectSubTabHandler(elo.id)}>{elo.name[elo.id]}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
            <div className="sub_tab">
                <ul>
                    {subTab_data.map((rl) => (
                        <li key={rl.id} onClick={() => selectSubTabHandler(rl.id)}>{rl.name[rl.id]}</li>
                    ))}
                </ul>
            </div>
            <div className="table_name">
                {props.name}
            </div>
            <div className="table">
                <table>
                    <thead className="table-header">
                    <tr>
                        <td style={{width: "100px"}}>탭</td>
                        <td style={{width: "450px"}}>제목</td>
                        <td style={{width: "150px"}}>작성자</td>
                        <td style={{width: "120px"}}>날짜</td>
                        <td style={{width: "120px"}}>조회</td>
                        <td style={{width: "100px"}}>추천</td>
                    </tr>
                    </thead>
                    <tbody id="tbody">
                    {game1BoardList.map((boards, idx) => {
                        return (
                            <tr key={boards.boardNo}>
                                <td>{boards.boardTab}</td>
                                {/*<td>*/}
                                {/*    <Link to={{ pathname: `/detailBoard/${boards.boardNo}` }} style={{textDecoration: 'none', color: 'white'}}>*/}
                                {/*        {boards.boardTitle}*/}
                                {/*    </Link>*/}
                                {/*</td>*/}
                                <td>
                                    <Link to={{ pathname: `/board/${boards.boardNo}` }} state={{ boardNo: `${boards.boardNo}` }} onClick={() => changeDetailBoard(boards.boardNo)} style={{textDecoration: 'none', color: 'white'}}>
                                        {boards.boardTitle}
                                    </Link>
                                </td>
                                <td>{boards.boardAuthor}</td>
                                <td>{boards.modifiedDate}</td>
                                <td>{boards.modifiedDate}</td>
                                <td>{boards.id}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>

                <Link to="/save">
                    <button>등록</button>
                </Link>
            </div>
        </>

    )
}

export default Game1Board;