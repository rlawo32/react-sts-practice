import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AppBarNavigation from "../Navigation/AppBarNavigation";
import BoardTagBarNavigation from "./BoardTagBarNavigation";
import Game2Board from "./Game2Board";
import Game3Board from "./Game3Board";
import Game4Board from "./Game4Board";
import Game5Board from "./Game5Board";
import Game6Board from "./Game6Board";

const Game1Board = () => {

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
        axios({
            method: "GET",
            url: '/game1BoardList'
        }).then(res=>{
            setGame1BoardList(res.data.game1BoardList);
        }).catch(error=>{
            console.log(error);
        });
        /*axios.get("/postsList")
            .then(res => setPostsList(res.data.postsList))
            .catch(error => console.log(error))*/
    }, []);

    const [currentTab, clickTab] = useState(0);

    const subTab_data = [
        {
            id: 0,
            name: subTab_name,
            view: <Game1Board />
        },
        {
            id: 1,
            name: subTab_name,
            view: <Game2Board />
        },
        {
            id: 2,
            name: subTab_name,
            view: <Game3Board />
        },
        {
            id: 3,
            name: subTab_name,
            view: <Game4Board />
        },
        {
            id: 4,
            name: subTab_name,
            view: <Game5Board />
        },
        {
            id: 5,
            name: subTab_name,
            view: <Game6Board />
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
            <ul className="sub_tab">
                {subTab_data.map((el) => (
                    <li key={el.id} onClick={() => selectSubTabHandler(el.id)}>{el.name[el.id]}</li>
                ))}
            </ul>
            <div>
                리그 오브 레전드
                <table className="table table-bordered table-sm">
                    <thead className="table-header">
                    <tr style={{color: "white"}}>
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
                            <tr key={boards.id}>
                                <td>{boards.boardTab}</td>
                                <td>{boards.boardTitle}</td>
                                <td>{boards.author}</td>
                                <td>{boards.content}</td>
                                <td>{boards.modifiedDate}</td>
                                <td>{boards.id}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
            <div style={ {paddingTop:"15px"} }>
                <Link to="/save">
                    <button>등록</button>
                </Link>
            </div>
        </>

    )
}

export default Game1Board;