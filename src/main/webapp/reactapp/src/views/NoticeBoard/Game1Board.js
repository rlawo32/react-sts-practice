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

    const [postsList, setPostsList] = useState([{
        id: '',
        title: '',
        author: '',
        content: '',
        modifiedDat: ''
    }]);

    useEffect(() => {
        axios({
            method: "GET",
            url: '/postsList'
        }).then(res=>{
            setPostsList(res.data.postsList);
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
                ---------------------------
                <table className="table table-bordered table-sm">
                    <thead className="table-header">
                    <tr>
                        <td>게시글번호</td>
                        <td>제목</td>
                        <td>작성자</td>
                        <td>내용</td>
                        <td>최종수정일</td>
                    </tr>
                    </thead>
                    <tbody id="tbody">
                    {postsList.map((posts, idx) => {
                        return (
                            <tr key={posts.id}>
                                <td>{posts.id}</td>
                                <td>{posts.title}</td>
                                <td>{posts.author}</td>
                                <td>{posts.content}</td>
                                <td>{posts.modifiedDate}</td>
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