import {Routes, Route} from "react-router-dom";
import './App.css';
import MainHome from "./views/Navigation/MainHome";
import BoardWrite from "./views/NoticeBoard/BoardWrite";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp/SignUp";
import FindPasswordView from "./views/SignIn/FindPasswordView";
import BoardMain from "./views/NoticeBoard/BoardMain";
import BoardTable from "./views/NoticeBoard/BoardTable";
import BoardDetail from "./views/NoticeBoard/BoardDetail";
import MemberInfo from "./views/MemberInfo/MemberInfo";
import ImageModal from "./views/NoticeBoard/ImageModal";
import 'bootstrap/dist/css/bootstrap.css';
import {Component} from "react";
import axios from "axios";
import {getCookie, setCookie} from "./views/Navigation/Cookie";

class App extends Component {

    componentDidMount() {
        if(getCookie('refreshToken')) {
            let token = {
                accessToken: "",
                refreshToken: getCookie('refreshToken')
            }

            axios({
                method: "POST",
                url: "/auth/reissue",
                data: JSON.stringify(token),
                headers: {'Content-type': 'application/json'}
            }).then((response) => {
                const responseData = response.data;
                this.onLoginSuccess(responseData);
            })
        }
    }

    onLoginSuccess(response) {
        const { grantType, accessToken, refreshToken, accessTokenExpiresIn} = response.data;

        const expires = new Date(accessTokenExpiresIn);

        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        axios.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;

        // refreshToken은 cookie에 담아놓기
        setCookie('refreshToken', refreshToken, {
            path: '/',
            // httpOnly: true,
            expires
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Routes>
                        <Route exact path="/" element={<MainHome />} />
                        <Route path="/save" element={<BoardWrite />} />
                        <Route path="/signIn" element={<SignIn />} />
                        <Route path="/signUp" element={<SignUp />} />
                        <Route path="/findPasswordView" element={<FindPasswordView />} />
                        <Route path="/board" element={<BoardMain />} />
                        <Route path="/memberInfo" element={<MemberInfo />} />

                        <Route path="/tableBoard" element={<BoardTable />} />
                        <Route path="/detailBoard" element={<BoardDetail />} />
                        <Route path="/imageModal" element={<ImageModal />} />
                        <Route path="/board/:boardId" element={<BoardMain />} />
                        <Route path="/board/:boardId" element={<BoardDetail />} />
                    </Routes>
                </header>
            </div>
        );
    }

}

export default App;
