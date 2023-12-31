import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import {Link} from "react-router-dom";

const MemberInfoRecommendLog = () => {

    const [recommendLogSelect, setRecommendLogSelect] = useState(false);

    const [pageNo, setPageNo] = useState(0);
    const [totalPageB, setTotalPageB] = useState(0);
    // const [totalRecommendsB, setTotalRecommendsB] = useState(0);
    const [totalPageC, setTotalPageC] = useState(0);
    // const [totalRecommendsC, setTotalRecommendsC] = useState(0);

    const [boardRecommendList, setBoardRecommendList] = useState([{
        recommendLogNo: '',
        recommendId: '',
        boardId: '',
        recommendType: '',
        recommendCategory: '',
        targetAuthor: '',
        targetData: '',
        createdDate: ''
    }]);

    const [commentRecommendList, setCommentRecommendList] = useState([{
        recommendLogNo: '',
        recommendId: '',
        boardId: '',
        recommendType: '',
        recommendCategory: '',
        targetAuthor: '',
        targetData: '',
        createdDate: ''
    }]);

    const paginationB = () => {
        let result = [];
        for (let i=0; i<totalPageB; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}><button className="list-item">{i+1}</button></li>);
        }
        return result;
    }

    const paginationC = () => {
        let result = [];
        for (let i=0; i<totalPageC; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}><button className="list-item">{i+1}</button></li>);
        }
        return result;
    }

    useEffect(() => {

        const paging = {
            recordPerPage: 10,
            page: pageNo
        }
        const getRecommends = async () => {

            const boardRecommends = await axios({
                method: "GET",
                url: '/board/recommendList',
                params: paging
            })

            const boardDataList = boardRecommends.data.boardRecommendList;
            const commentDataList = boardRecommends.data.commentRecommendList;

            setBoardRecommendList(boardDataList);
            setCommentRecommendList(commentDataList);
            setTotalPageB(boardRecommends.data.totalPageB);
            // setTotalRecommendsB(boardRecommends.data.totalRecommendsB);
            setTotalPageC(boardRecommends.data.totalPageC);
            // setTotalRecommendsC(boardRecommends.data.totalRecommendsC);


            for(let i=0; i<boardDataList.length; i++) {
                boardDataList[i].recommendLogNo = (i + (pageNo * 10)) + 1;
            }

            for(let i=0; i<commentDataList.length; i++) {
                commentDataList[i].recommendLogNo = (i  + (pageNo * 10)) + 1;
            }

        };

        getRecommends();

    }, [pageNo])

    return (
        <div>

            <h3>내 추천 확인</h3>

            <div className="recommendLog-view">

                <div className="recommendLog-select">
                    <div onClick={() => setRecommendLogSelect(false)}>게시글 추천</div>
                    <div onClick={() => setRecommendLogSelect(true)}>댓글 추천</div>
                </div>

                {
                    recommendLogSelect ?
                        <div>
                            <div className="table-view">
                                <table>
                                    <thead className="table-header">
                                    <tr>
                                        <td style={{width: "70px"}}>번호</td>
                                        <td style={{width: "150px"}}>분류</td>
                                        <td style={{width: "400px"}}>내용</td>
                                        <td style={{width: "150px"}}>작성자</td>
                                        <td style={{width: "150px"}}>날짜</td>
                                    </tr>
                                    </thead>
                                    {
                                        commentRecommendList.length < 1 ?
                                            <tbody id="tbody" className="font-custom">
                                                <tr>
                                                    <td colSpan={5}>추천이 없습니다.</td>
                                                </tr>
                                            </tbody>
                                            :
                                            <tbody id="tbody" className="font-custom">
                                                {commentRecommendList.map((commentRecommends, idx) => {
                                                    return (
                                                        <tr key={commentRecommends.recommendId}>
                                                            <td>{commentRecommends.recommendLogNo}</td>
                                                            { `${commentRecommends.recommendType}` === 'U' && <td>추천 Up</td> }
                                                            { `${commentRecommends.recommendType}` === 'D' && <td>추천 Down</td> }
                                                            <td>
                                                                <Link to={{ pathname: `/board/${commentRecommends.boardId}` }}
                                                                      state={{ boardId: `${commentRecommends.boardId}` }}
                                                                      style={{textDecoration: 'none', color: 'white'}}>
                                                                    {commentRecommends.targetData}
                                                                </Link>
                                                            </td>
                                                            <td>{commentRecommends.targetAuthor}</td>
                                                            <td>{commentRecommends.createdDate.substring(0,10)}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                    }
                                </table>
                            </div>
                            <div className="paging-design">
                                <ul>
                                    {paginationC()}
                                </ul>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="table-view">
                                <table>
                                    <thead className="table-header">
                                    <tr>
                                        <td style={{width: "70px"}}>번호</td>
                                        <td style={{width: "150px"}}>분류</td>
                                        <td style={{width: "400px"}}>제목</td>
                                        <td style={{width: "150px"}}>작성자</td>
                                        <td style={{width: "150px"}}>날짜</td>
                                    </tr>
                                    </thead>
                                    {
                                        boardRecommendList.length < 1 ?
                                            <tbody id="tbody" className="font-custom">
                                                <tr>
                                                    <td colSpan={5}>추천이 없습니다.</td>
                                                </tr>
                                            </tbody>
                                            :
                                            <tbody id="tbody" className="font-custom">
                                                {boardRecommendList.map((boardRecommends, idx) => {
                                                    return (
                                                        <tr key={boardRecommends.recommendId}>
                                                            <td>{boardRecommends.recommendLogNo}</td>
                                                            { `${boardRecommends.recommendType}` === 'U' && <td>추천 Up</td> }
                                                            { `${boardRecommends.recommendType}` === 'D' && <td>추천 Down</td> }
                                                            <td>
                                                                <Link to={{ pathname: `/board/${boardRecommends.boardId}` }}
                                                                      state={{ boardId: `${boardRecommends.boardId}` }}
                                                                      style={{textDecoration: 'none', color: 'white'}}>
                                                                    {boardRecommends.targetData}
                                                                </Link>
                                                            </td>
                                                            <td>{boardRecommends.targetAuthor}</td>
                                                            <td>{boardRecommends.createdDate.substring(0,10)}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                    }
                                </table>
                            </div>
                            <div className="paging-design">
                                <ul>
                                    {paginationB()}
                                </ul>
                            </div>
                        </div>
                }

            </div>

        </div>
    )
}

export default MemberInfoRecommendLog;