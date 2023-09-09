import {Link, useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import AppBarNavigation from "../Navigation/AppBarNavigation";
import './MainBoard.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faPen} from "@fortawesome/free-solid-svg-icons";

const TableBoard = (props) => {
    const navigate = useNavigate();

    const subTab_name = ['전체', '화제', '정보', '오류', '사진/동영상', '팁과 노하우'];
    const [currentSubTab, clickSubTab] = useState("");
    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const [searchText, setSearchText] = useState("");
    const [searchSelect, setSearchSelect] = useState("title");

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
        searchText: searchText,
        searchSelect: searchSelect,
        recordPerPage: 5,
        page: pageNo,
        pagePerBlock: 10,
        pageSort: currentSubTab
    }

    const pagination = () => {
        let result = [];
        for (let i=0; i<totalPage; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}><button className="list-item">{i+1}</button></li>);
        }
        return result;
    }

    useEffect(() => {
        const getBoards = async () => {
            const tableBoardList = await axios({
                method: "GET",
                url: '/board/tableBoardList',
                params: paging
            });
            setGame1BoardList(tableBoardList.data.boardList);
            setTotalPage(tableBoardList.data.totalPage);
            console.log(tableBoardList.data);
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
            url: '/board/viewsUp',
            data: JSON.stringify(viewsBody),
            headers: {'Content-type': 'application/json'}
        })

    }

    const changeSearchBoard = async () => {
        const search = await axios({
            method: "GET",
            url: '/board/tableBoardList',
            params: paging
        });
        setGame1BoardList(search.data.boardList);
        setTotalPage(search.data.totalPage);
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
            setSearchText("");
            // navigate("/board");
        } else {
            clickSubTab(subTabName);
        }
    }

    const searchTextHandler = ({target: {value}}) => {
        setSearchText(value);
    }

    const searchSelectHandler = ({target: {value}}) => {
        setSearchSelect(value);
    }


    return (
        <>
            <AppBarNavigation />
            {/*<ul>*/}
            {/*    {subTab_name.map((elo) => (*/}
            {/*        <li key={elo.id} onClick={() => selectSubTabHandler(elo.id)}>{elo.name[elo.id]}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
            <div className="main-board">
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
                <div className="board-table">
                    <div className="board-header">
                        <div className="board-search">
                            <input className="search-box" type="text" placeholder="입력해주세요." onChange={searchTextHandler}/>
                            <select className="search-select" onChange={searchSelectHandler}>
                                <option value="title">제목</option>
                                <option value="content">내용</option>
                                <option value="nickname">닉네임</option>
                            </select>
                            <button className="search-btn" onClick={changeSearchBoard}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
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
                    <div className="board-footer">
                        <div className="board-write">
                            <Link to="/save" state={{subTab_name}}>
                                <button className="write-box"><FontAwesomeIcon icon={faPen} /> 글 쓰기</button>
                            </Link>
                        </div>
                        <div className="board-paging">
                            <ul>
                                {pagination()}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default TableBoard;