import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import './BoardMain.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faPen, faComment} from "@fortawesome/free-solid-svg-icons";
import {getCookie} from "../Navigation/Cookie";

const BoardTable = (props) => {

    const [isLoginCheck, setIsLoginCheck] = useState(false);

    const category_name = props.category;
    const subTab_name = props.subTab;
    const [currentSubTab, clickSubTab] = useState(subTab_name[0].key);
    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const [searchText, setSearchText] = useState("");
    const [searchSelect, setSearchSelect] = useState("title");

    const [tableBoardList, setTableBoardList] = useState([{
        boardNo: '',
        boardId: '',
        boardTab: '',
        boardTitle: '',
        boardContent: '',
        boardAuthor: '',
        boardAuthorId: '',
        modifiedDate: '',
        boardCommentCnt: '',
        boardRecommendUpCnt: '',
        boardRecommendDownCnt: '',
        boardViewsCnt: ''
    }]);

    const paging = {
        searchText: searchText,
        searchSelect: searchSelect,
        recordPerPage: 10,
        page: pageNo,
        pagePerBlock: 10,
        pageCategory: props.keys,
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
            const datalist = tableBoardList.data.boardList;
            setTableBoardList(datalist);
            setTotalPage(tableBoardList.data.totalPage);

            for(let i=0; i<datalist.length; i++) {
                datalist[i].boardNo = (i  + (pageNo * 10)) + 1;
            }
        };

        getBoards();

        if(getCookie('refreshToken')) {
            setIsLoginCheck(true);
        } else {
            setIsLoginCheck(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNo, props.keys, currentSubTab, isLoginCheck]);

    const changeDetailBoard = async (changeBoardId, changeAuthorId) => {
        props.changeBoardId(changeBoardId);
        props.changeBoardAuthorId(changeAuthorId);
        props.setIsViewLoading(true);

        let viewsBody =  {
            boardId: changeBoardId
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
        setTableBoardList(search.data.boardList);
        setTotalPage(search.data.totalPage);
    }

    const changeSubTabHandler = () => {
        let subTab_data = [];
        for(let i=0; i<subTab_name.length; i++) {
            subTab_data.push({id: i, key: subTab_name[i].key, value: subTab_name[i].value});
        }
        return subTab_data;
    }

    const selectSubTabHandler = (subTabKey) => {
        if(subTabKey === 'T0') {
            setSearchText("");
            clickSubTab(subTabKey);
        } else {
            clickSubTab(subTabKey);
        }
    }

    const searchTextHandler = ({target: {value}}) => {
        setSearchText(value);
    }

    const searchSelectHandler = ({target: {value}}) => {
        setSearchSelect(value);
    }


    return (
        <div>
            <div className="main-board">
                <div className="board-tableName">
                    {props.value}
                </div>
                <div className="sub_tab">
                    <ul>
                        {changeSubTabHandler().map((rl) => (
                            <li key={rl.id} onClick={() => selectSubTabHandler(rl.key)}
                                style={rl.key === currentSubTab ?
                                    {color: '#61dafb', fontWeight:' bold', borderBottom: '2px solid #61dafb'}
                                    :
                                    {color: '#dde0e3'}}>
                                {rl.value}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="board-table">
                    <div className="board-header">
                        <span className="board-write">
                            <Link to="/save" state={{subTab_name, category_name}} style={ isLoginCheck ? {} : {visibility: "hidden"} }>
                                <button className="write-box"><FontAwesomeIcon icon={faPen} /> 글 쓰기</button>
                            </Link>
                        </span>
                        <span className="board-search">
                            <input className="search-box" type="text" placeholder="입력해주세요." onChange={searchTextHandler}/>
                            <select className="search-select" onChange={searchSelectHandler}>
                                <option value="title">제목</option>
                                <option value="content">내용</option>
                                <option value="nickname">닉네임</option>
                            </select>
                            <button className="search-btn" onClick={changeSearchBoard}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </span>
                    </div>

                    <div className="table-view">
                        <table>
                            <thead className="table-header">
                                <tr style={{height: "35px"}}>
                                    <td style={{width: "50px"}}>NO.</td>
                                    <td style={{width: "80px"}}>탭</td>
                                    <td style={{width: "250px"}}>제목</td>
                                    <td style={{width: "70px"}}>작성자</td>
                                    <td style={{width: "100px"}}>날짜</td>
                                    <td style={{width: "50px"}}>조회수</td>
                                    <td style={{width: "50px"}}>추천수</td>
                                </tr>
                            </thead>
                            <tbody id="tbody" className="font-list">
                            {tableBoardList.map((boards, idx) => {
                                return (
                                    <tr key={boards.boardId} style={{height: "45px"}}>
                                        <td>{boards.boardId}</td>
                                        { `${boards.boardTab}` === 'T1' && <td>화제</td> }
                                        { `${boards.boardTab}` === 'T2' && <td>정보</td> }
                                        { `${boards.boardTab}` === 'T3' && <td>오류</td> }
                                        { `${boards.boardTab}` === 'T4' && <td>사진/동영상</td> }
                                        { `${boards.boardTab}` === 'T5' && <td>팁과 노하우</td> }
                                        <td>
                                            <Link to={{ pathname: `/board/${boards.boardId}` }} state={{ boardId: `${boards.boardId}` }}
                                                  onClick={() => changeDetailBoard(boards.boardId, boards.boardAuthorId)} style={{textDecoration: 'none', color: 'white'}}>
                                                {boards.boardTitle}
                                            </Link>
                                            {
                                                boards.boardCommentCnt < 1 ?
                                                    null
                                                    :
                                                    <span className="board-comment-cnt">
                                                        <FontAwesomeIcon icon={faComment} style={{fontSize: '13px'}}/>&nbsp;
                                                        {boards.boardCommentCnt}
                                                    </span>
                                            }
                                            {
                                                ((new Date() - new Date(boards.modifiedDate)) / 1000 / 60).toFixed(0) > 5 ?
                                                    null
                                                    :
                                                    <span className="board-write-new">
                                                        N
                                                    </span>
                                            }
                                        </td>
                                        <td>{boards.boardAuthor}</td>
                                        <td>
                                            {
                                                ((new Date() - new Date(boards.modifiedDate)) / 1000 / 60 / 60).toFixed(0) > 24 ?
                                                    boards.modifiedDate.substring(0, 10)
                                                    :
                                                    boards.modifiedDate.substring(11)
                                            }
                                        </td>
                                        <td>{boards.boardViewsCnt}</td>
                                        <td>{boards.boardRecommendUpCnt - boards.boardRecommendDownCnt}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>

                    <div className="board-footer">
                        <div className="board-paging">
                            <ul>
                                {pagination()}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BoardTable;