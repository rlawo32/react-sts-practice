import React, { useState } from "react";
import axios from "axios";
import cookie from "react-cookies";
import {Link, useNavigate} from "react-router-dom";
import AppBarNavigation from "../Navigation/AppBarNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";

const googleOauthLogin = () => {
    window.location.href = `http://localhost:8080/oauth2/authorization/google`;
    // window.location.href = `/login/oauth2/code/google`;
}

const SignIn = () => {
    const navigate = useNavigate();

    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [isLoginConfirmEffect, setIsLoginConfirmEffect] = useState(false);

    const [loginMemberEmail, setLoginMemberEmail] = useState("");
    const [loginMemberPw, setLoginMemberPw] = useState("");

    const onMemberEmailHandler = (e) => {
        setLoginMemberEmail(e.target.value);
    }

    const onMemberPasswordHandler = (e) => {
        setLoginMemberPw(e.target.value);
    }

    const onLoginHandler = async (e) => {
        e.preventDefault();

        let loginBody = {
            memberEmail: loginMemberEmail,
            memberPw: loginMemberPw
        }

        await axios({
            method: "POST",
            url: "/member/signIn",
            data: JSON.stringify(loginBody),
            headers: {'Content-type': 'application/json'}
        }).then((response) => {
            const responseData = response.data;
            if(responseData.data) {
                // localStorage.setItem("users", JSON.stringify(response.data));

                // const { token, exprTime, users } = responseData.data;
                // console.log("token" + token);
                // const expires = new Date();
                // expires.setMilliseconds(expires.getMilliseconds + exprTime);
                //
                // setCookies('token', token, {expires});
                onLoginSuccess(responseData);

                navigate('/');
            } else {
                setIsLoginConfirmEffect(false);
                setLoginErrorMessage("ID가 존재하지 않거나 비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
            }

        })
    }

    const onSilentRefresh = async () => {

        let token = {
            accessToken: loginMemberEmail,
            refreshToken: loginMemberPw
        }

        await axios({
            method: "POST",
            url: "/auth/reissue",
            data: JSON.stringify(token),
            headers: {'Content-type': 'application/json'}
        }).then((response) => {
            const responseData = response.data;
            onLoginSuccess(responseData);
        })
    }

    const onLoginSuccess = (response) => {
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
        // accessToken을 localStorage, cookie 등에 저장하지 않는다!

        // accessToken 만료하기 1분 전에 로그인 연장
        // setTimeout(onSilentRefresh, accessTokenExpiresIn - 60000);
    }

    return (
        <div className="signIn-body">
            <AppBarNavigation />

            <div className="signIn-view">

                <div className="easy-signIn">
                    <h1>간편 로그인</h1>
                    <div className="signIn-google">
                        <button onClick={googleOauthLogin}>구글 로그인</button>
                    </div>
                    <div className="signIn-naver">
                        <button onClick={googleOauthLogin}>네이버 로그인</button>
                    </div>
                    <div className="signIn-kakao">
                        <button onClick={googleOauthLogin}>카카오 로그인</button>
                    </div>
                </div>

                <div className="common-signIn">
                    <h1>일반 로그인</h1>
                    <div className="signIn-email">
                        <input type="text" value={loginMemberEmail} onChange={onMemberEmailHandler} placeholder="이메일"/>
                    </div>
                    <div className="signIn-password">
                        <input type="password" value={loginMemberPw} onChange={onMemberPasswordHandler} placeholder="비밀번호"/>
                    </div>
                    {(
                        <span style={ isLoginConfirmEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{loginErrorMessage}</span>
                    )}
                    <div className="on-submit">
                        <button onClick={onLoginHandler} className="on-signIn">
                            로그인
                        </button>
                        <Link to="/signUp">
                            <button className="on-signUp">
                                회원가입
                            </button>
                        </Link>
                    </div>
                </div>

            </div>

            <FooterNavigation />
        </div>
    )
}

export default SignIn;