import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faReply as nestedArrow,
    faThumbsDown as recommendDown,
    faThumbsUp as recommendUp
} from "@fortawesome/free-solid-svg-icons";
import {
    faThumbsDown as recommendDownCancel,
    faThumbsUp as recommendUpCancel
} from "@fortawesome/free-regular-svg-icons";
import {Link} from "react-router-dom";

const MemberInfoCommentLog = () => {

    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [logNo, setLogNo] = useState(0);

    const [commentList, setCommentList] = useState([{
        commentLogNo: '',
        commentId: '',
        commentNestedId: '',
        commentNestedLevel: '',
        commentContent: '',
        boardId: '',
        memberId: '',
        memberNickname: '',
        createdDate: '',
        modifiedDate: '',
        commentRecommendUpCnt: '',
        commentRecommendDownCnt: '',
        commentRecommendUpCheck: '',
        commentRecommendDownCheck: '',
        commentBoardCategory: ''
    }]);

    const paging = {
        boardId: 0,
        recordPerPage: 10,
        page: pageNo
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

            const boardComments = await axios({
                method: "GET",
                url: '/board/commentList',
                params: paging
            })

            const datalist = boardComments.data.commentList;

            setCommentList(datalist);
            setTotalPage(boardComments.data.totalPage);
            setTotalComments(boardComments.data.totalComments);

            for(let i=0; i<datalist.length; i++) {
                datalist[i].commentLogNo = (i  + (pageNo * 10)) + 1;
            }
        };

        getBoards();

    }, [pageNo])

    return (
        <div className="member-info">

            <h3>내 댓글 확인</h3>

            <div className="commentLog-view">

                <table>
                    <thead className="table-header">
                    <tr>
                        <td style={{width: "100px"}}>번호</td>
                        <td style={{width: "400px"}}>게시판</td>
                        <td style={{width: "150px"}}>내용</td>
                        <td style={{width: "170px"}}>추천</td>
                        <td style={{width: "120px"}}>날짜</td>
                    </tr>
                    </thead>
                    <tbody id="tbody">
                    {commentList.map((comments, idx) => {
                        return (
                            <tr key={comments.commentId}>
                                <td>{comments.commentLogNo}</td>
                                { `${comments.commentBoardCategory}` === 'C1' && <td>리그오브레전드</td> }
                                { `${comments.commentBoardCategory}` === 'C2' && <td>오버워치</td> }
                                { `${comments.commentBoardCategory}` === 'C3' && <td>배틀그라운드</td> }
                                { `${comments.commentBoardCategory}` === 'C4' && <td>메이플스토리</td> }
                                { `${comments.commentBoardCategory}` === 'C5' && <td>마인크래프트</td> }
                                { `${comments.commentBoardCategory}` === 'C6' && <td>스팀</td> }
                                <td>{comments.commentContent}</td>
                                <td>{comments.commentRecommendUpCnt - comments.commentRecommendDownCnt}</td>
                                <td>{comments.modifiedDate.substring(0,10)}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
                <div className="comment-paging">
                    <ul>
                        {pagination()}
                    </ul>
                </div>

            </div>

        </div>
    )
}

export default MemberInfoCommentLog;