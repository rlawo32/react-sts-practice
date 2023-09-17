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

                <table>
                    <thead className="table-header">
                    <tr>
                        <td style={{width: "80px"}}>번호</td>
                        <td style={{width: "200px"}}>탭</td>
                        <td style={{width: "400px"}}>제목</td>
                        <td style={{width: "150px"}}>작성자</td>
                        <td style={{width: "80px"}}>조회</td>
                        <td style={{width: "80px"}}>추천</td>
                        <td style={{width: "150px"}}>날짜</td>
                    </tr>
                    </thead>
                    <tbody id="tbody">
                    {tableBoardList.map((boards, idx) => {
                        return (
                            <tr key={boards.boardId}>
                                <td>{boards.boardLogNo}</td>
                                { `${boards.boardTab}` === 'T1' && <td>화제</td> }
                                { `${boards.boardTab}` === 'T2' && <td>정보</td> }
                                { `${boards.boardTab}` === 'T3' && <td>오류</td> }
                                { `${boards.boardTab}` === 'T4' && <td>사진/동영상</td> }
                                { `${boards.boardTab}` === 'T5' && <td>팁과 노하우</td> }
                                <td>
                                    <Link to={{ pathname: `/board/${boards.boardId}` }} state={{ boardId: `${boards.boardId}` }} style={{textDecoration: 'none', color: 'white'}}>
                                        {boards.boardTitle}
                                    </Link>
                                </td>
                                <td>{boards.boardAuthor}</td>
                                <td>{boards.boardViewsCnt}</td>
                                <td>{boards.boardRecommendUpCnt - boards.boardRecommendDownCnt}</td>
                                <td>{boards.modifiedDate.substring(0,10)}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
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