import {Routes, Route} from "react-router-dom";
import './App.css';
import MainHome from "./views/Navigation/MainHome";
import Save from "./views/Navigation/Save";
import About from "./views/Navigation/About";
import SignIn from "./views/SignIn/SignIn";
import SignUp from "./views/SignUp/SignUp";
import FindPasswordView from "./views/SignIn/FindPasswordView";
import MainBoard from "./views/NoticeBoard/MainBoard";
import TableBoard from "./views/NoticeBoard/TableBoard";
import DetailBoard from "./views/NoticeBoard/DetailBoard";
import MemberInfo from "./views/MemberInfo/MemberInfo";
import 'bootstrap/dist/css/bootstrap.css';
import {Component} from "react";
import axios from "axios";
import cookie from "react-cookies";

class App extends Component {


    componentDidMount() {
        if(cookie.load('refreshToken')) {
            let token = {
                accessToken: "",
                refreshToken: cookie.load('refreshToken')
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
        console.log("잘 되는지 확인하자 !!");

        const { grantType, accessToken, refreshToken, accessTokenExpiresIn} = response.data;

        const expires = new Date(accessTokenExpiresIn);

        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        axios.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;

        // refreshToken은 cookie에 담아놓기
        cookie.save('refreshToken', refreshToken, {
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
                        <Route path="/save" element={<Save />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/signIn" element={<SignIn />} />
                        <Route path="/signUp" element={<SignUp />} />
                        <Route path="/findPasswordView" element={<FindPasswordView />} />
                        <Route path="/board" element={<MainBoard />} />
                        <Route path="/memberInfo" element={<MemberInfo />} />

                        <Route path="/tableBoard" element={<TableBoard />} />
                        <Route path="/detailBoard" element={<DetailBoard />} />
                        <Route path="/board/:boardId" element={<MainBoard />} />
                        <Route path="/board/:boardId" element={<DetailBoard />} />
                    </Routes>
                </header>
            </div>
        );
    }

}

export default App;
