import {Link} from "react-router-dom";
import logo from "../logo.svg";
import {useEffect, useState} from "react";
import axios from "axios";
import Button from 'react-bootstrap/Button';

const loginTest = () => {
    window.location.href = `/oauth2/authorization/google`;
}

const Home = () => {

    const accessToken = new URL(window.location.href).searchParams.get("accessToken");
    const refreshToken = new URL(window.location.href).searchParams.get("refreshToken");

    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    const [postsList, setPostsList] = useState([{
        id: '',
        title: '',
        author: '',
        content: '',
        modifiedDate: ''
    }]);

    useEffect(() => {
        axios({
            method: "GET",
            url: '/postsList'
        }).then((res)=>{
            setPostsList(res.data.postsList);
        }).catch(error=>{
            console.log(error);
        });
        /*axios.get("/postsList")
            .then(res => setPostsList(res.data.postsList))
            .catch(error => console.log(error))*/
    }, []);

    return (
        <div className="App">
            <div className="App-header">
                <div>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <div>
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
                    <Link to="/signUp">
                        <button>회원가입</button>
                    </Link>
                    <Link to="/signIn">
                        <button>로그인</button>
                    </Link>
                </div>
                <div>
                    <Button onClick={loginTest}></Button>
                </div>
            </div>
        </div>
    )
}

export default Home;