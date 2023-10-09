import React, {useEffect, useState} from "react";
import '../NoticeBoard/BoardWrite.scss';
import axios from "axios";
import {Link, useLocation, useNavigate} from "react-router-dom";
import AppBarNavigation from "../Navigation/HeaderNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";

const BoardWrite = () => {
    const navigate = useNavigate();
    const props = useLocation().state;

    const categoryMenu = props.category_name;
    const tabMenu = props.subTab_name;

    const [componentTitle, setComponentTitle] = useState("");
    const [boardCategory, setBoardCategory] = useState("");
    const [boardTab, setBoardTab] = useState("");
    const [boardTitle, setBoardTitle] = useState("");
    const [boardContent, setBoardContent] = useState("");


    const boardCategoryChangeHandler = ({target: {value}}) => {
        setBoardCategory(value);
    }

    const boardTabChangeHandler = ({target: {value}}) => {
        setBoardTab(value);
    }

    const boardTitleChangeHandler = ({target: {value}}) => {
        setBoardTitle(value);
    }

    const boardContentChangeHandler = ({target: {value}}) => {
        setBoardContent(value);
    }

    const boardWrite = async() => {

        const BoardData = {
            boardCategory: `${boardCategory}`,
            boardTab: `${boardTab}`,
            boardTitle: `${boardTitle}`,
            boardContent: `${boardContent}`
        }

        if(props.boardDetail) {
            await axios({
                method: "PUT",
                url: "board/boardUpdate/" + props.boardDetail.boardId,
                data: JSON.stringify(BoardData),
                headers: {'Content-type': 'application/json'}
            }).then((result) => {
                window.alert("수정이 완료되었습니다.");
                navigate(-1);
            })
        } else {
            await axios({
                method: "POST",
                url: "board/boardSave",
                data: JSON.stringify(BoardData),
                headers: {'Content-type': 'application/json'}
            }).then((result) => {
                window.alert("등록이 완료되었습니다.");
                navigate('/board');
            })
        }
    }

    useEffect(() => {
        if(props.boardDetail) {
            setComponentTitle("수정");
            setBoardCategory(props.boardDetail.boardCategory);
            setBoardTab(props.boardDetail.boardTab);
            setBoardTitle(props.boardDetail.boardTitle);
            setBoardContent(props.boardDetail.boardContent);
        } else {
            setComponentTitle("등록");
            setBoardCategory(categoryMenu[1].key);
            setBoardTab(tabMenu[1].key);
        }
    }, [])

    return (
        <div className="write-body">
            <AppBarNavigation />


                <div className="write-view">
                    <h3>게시글 {componentTitle}</h3>

                    <div className="write-header">
                        <div className="write-category">
                            <div className="write-guide">
                                카테고리 선택
                            </div>
                            <div>
                                <select value={boardCategory} onChange={boardCategoryChangeHandler}>
                                    {categoryMenu.filter((cl) => (cl.key != "C0")).map((cl) => (
                                        <option key={cl.key} value={cl.key}>{cl.value}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="write-tab">
                            <div className="write-guide">
                                분류 선택
                            </div>
                            <select value={boardTab} onChange={boardTabChangeHandler}>
                                {tabMenu.filter((tl) => (tl.key != "T0")).map((tl) => (
                                    <option key={tl.key} value={tl.key}>{tl.value}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="write-title">
                        <div className="write-guide">
                            제목
                        </div>
                        <input type="text" value={boardTitle} onChange={boardTitleChangeHandler} placeholder="제목을 입력하세요"/>
                    </div>

                    <div className="write-content">
                        <div className="write-guide">
                            내용
                        </div>
                        <textarea rows={3}  value={boardContent} onChange={boardContentChangeHandler} placeholder="내용을 입력하세요"/>
                    </div>


                    <div className="on-submit">
                        <div className="on-cancel">
                            <Link to="/board">
                                <button>
                                    돌아가기
                                </button>
                            </Link>
                        </div>
                        <div className="on-preview">
                            <button>
                                미리보기
                            </button>
                        </div>
                        <div className="on-write">
                            <button onClick={boardWrite}>{componentTitle}</button>
                        </div>
                    </div>

                </div>

            <FooterNavigation />
        </div>
    )
}

export default BoardWrite;