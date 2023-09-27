import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import {Link} from "react-router-dom";

const MemberInfoBoardLog = () => {

    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    const [tableBoardList, setTableBoardList] = useState([{
        boardLogNo: '',
        boardId: '',
        boardCategory: '',
        boardTab: '',
        boardTitle: '',
        boardContent: '',
        boardAuthor: '',
        boardRecommendUpCnt: '',
        boardRecommendDownCnt: '',
        boardViewsCnt: '',
        modifiedDate: ''
    }]);

    const paging = {
        searchText: "",
        searchSelect: "M",
        recordPerPage: 5,
        page: pageNo,
        pagePerBlock: 10,
        pageCategory: "C0",
        pageSort: "T0"
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
                datalist[i].boardLogNo = (i  + (pageNo * 10)) + 1;
            }
        };

        getBoards();

    }, [])

    return (
        <div className="member-info">

            <h3>내 글 확인</h3>

            <div className="boardLog-view">

                <div className="table-view">
                    <table>
                        <thead className="table-header">
                        <tr>
                            <td style={{width: "70px"}}>번호</td>
                            <td style={{width: "220px"}}>게시판</td>
                            <td style={{width: "300px"}}>제목</td>
                            <td style={{width: "100px"}}>조회수</td>
                            <td style={{width: "100px"}}>추천수</td>
                            <td style={{width: "150px"}}>날짜</td>
                        </tr>
                        </thead>
                        {
                            tableBoardList.length < 1 ?
                                <tbody id="tbody" className="font-custom">
                                    <tr>
                                        <td colSpan={6}>등록된 글이 없습니다.</td>
                                    </tr>
                                </tbody>
                                :
                                <tbody id="tbody" className="font-custom">
                                    {tableBoardList.map((boards, idx) => {
                                        return (
                                            <tr key={boards.boardId}>
                                                <td>{boards.boardLogNo}</td>
                                                { `${boards.boardCategory}` === 'C1' && <td>리그오브레전드</td> }
                                                { `${boards.boardCategory}` === 'C2' && <td>오버워치</td> }
                                                { `${boards.boardCategory}` === 'C3' && <td>배틀그라운드</td> }
                                                { `${boards.boardCategory}` === 'C4' && <td>메이플스토리</td> }
                                                { `${boards.boardCategory}` === 'C5' && <td>마인크래프트</td> }
                                                { `${boards.boardCategory}` === 'C6' && <td>스팀</td> }
                                                <td>
                                                    <Link to={{ pathname: `/board/${boards.boardId}` }} state={{ boardId: `${boards.boardId}` }} style={{textDecoration: 'none', color: 'white'}}>
                                                        {boards.boardTitle}
                                                    </Link>
                                                </td>
                                                <td>{boards.boardViewsCnt}</td>
                                                <td>{boards.boardRecommendUpCnt - boards.boardRecommendDownCnt}</td>
                                                <td>{boards.modifiedDate.substring(0,10)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                        }
                    </table>
                </div>
                <div className="paging-design">
                    <ul>
                        {pagination()}
                    </ul>
                </div>

            </div>

        </div>
    )
}

export default MemberInfoBoardLog;