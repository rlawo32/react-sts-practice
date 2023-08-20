import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import AppBarNavigation from "../Navigation/AppBarNavigation";
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import './MainBoard.scss';

const Game1Board = (props) => {

    const subTab_name = ['전체', '화제', '정보', '오류', '사진/동영상', '팁과 노하우'];
    const [currentSubTab, clickSubTab] = useState("");
    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const [game1BoardList, setGame1BoardList] = useState([{
        boardId: '',
        boardTab: '',
        boardTitle: '',
        boardContent: '',
        boardAuthor: '',
        boardRecommendCnt: '',
        boardViewsCnt: '',
        modifiedDate: ''
    }]);

    const paging = {
        recordPerPage: 5,
        page: pageNo,
        pagePerBlock: 10,
        pageSort: currentSubTab
    }

    const pagination = () => {
        let result = [];
        for (let i=0; i<totalPage; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}>{i+1}</li>);
        }
        return result;
    }

    useEffect(() => {
        const getBoards = async () => {
            const game1Board = await axios({
                method: "GET",
                url: '/game1BoardList',
                params: paging
            });
            setGame1BoardList(game1Board.data.boardList);
            setTotalPage(game1Board.data.totalPage);
        };

        getBoards();
    }, [pageNo, currentSubTab]);

    const changeDetailBoard = async (itemID) => {
        const detailBoardId = itemID;
        props.changeBoardId(detailBoardId);

        let viewsBody =  {
            boardId: detailBoardId,
            memberId: 9999
        }

        await axios({
            method: "POST",
            url: '/viewsUp',
            data: JSON.stringify(viewsBody),
            headers: {'Content-type': 'application/json'}
        })

    }

    const changeSubTabHandler = () => {
        let subTab_data = [];
        for(let i=0; i<subTab_name.length; i++) {
            subTab_data.push({id: i, name: subTab_name[i]});
        }
        return subTab_data;
    }

    const selectSubTabHandler = (subTabName) => {
        if(subTabName == '전체') {
            clickSubTab("");
        } else {
            clickSubTab(subTabName);
        }
    }

    return (
        <>
            <AppBarNavigation />
            {/*<ul>*/}
            {/*    {subTab_name.map((elo) => (*/}
            {/*        <li key={elo.id} onClick={() => selectSubTabHandler(elo.id)}>{elo.name[elo.id]}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
            <div className="board-table">
                <div className="sub_tab">
                    <ul>
                        {changeSubTabHandler().map((rl) => (
                            <li key={rl.id} onClick={() => selectSubTabHandler(rl.name)}>{rl.name}</li>
                        ))}
                    </ul>
                </div>
                <div className="board-tableName">
                    {props.name}
                </div>
                <div className="board-search">
                    <input type="text"/>
                </div>
                <table>
                    <thead className="table-header">
                    <tr>
                        <td style={{width: "100px"}}>탭</td>
                        <td style={{width: "400px"}}>제목</td>
                        <td style={{width: "150px"}}>작성자</td>
                        <td style={{width: "170px"}}>날짜</td>
                        <td style={{width: "120px"}}>조회</td>
                        <td style={{width: "100px"}}>추천</td>
                    </tr>
                    </thead>
                    <tbody id="tbody">
                    {game1BoardList.map((boards, idx) => {
                        return (
                            <tr key={boards.boardId}>
                                <td>{boards.boardTab}</td>
                                {/*<td>*/}
                                {/*    <Link to={{ pathname: `/detailBoard/${boards.boardNo}` }} style={{textDecoration: 'none', color: 'white'}}>*/}
                                {/*        {boards.boardTitle}*/}
                                {/*    </Link>*/}
                                {/*</td>*/}
                                <td>
                                    <Link to={{ pathname: `/board/${boards.boardId}` }} state={{ boardId: `${boards.boardId}` }} onClick={() => changeDetailBoard(boards.boardId)} style={{textDecoration: 'none', color: 'white'}}>
                                        {boards.boardTitle}
                                    </Link>
                                </td>
                                <td>{boards.boardAuthor}</td>
                                <td>{boards.modifiedDate}</td>
                                <td>{boards.boardViewsCnt}</td>
                                <td>{boards.boardRecommendCnt}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className="board-paging">
                    <ul>
                        {pagination()}
                    </ul>
                </div>
                <div className="board-write">
                    <Link to="/save" state={{subTab_name}}>
                        <button>등록</button>
                    </Link>
                </div>
            </div>
        </>

    )
}

export default Game1Board;