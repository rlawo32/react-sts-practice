import React, {useRef, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import AppBarNavigation from "../Navigation/HeaderNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import './SignIn.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
        faComment as kakaoIcon,
        faEye as passwordSeeIcon,
        faChartSimple as logoIcon
        } from "@fortawesome/free-solid-svg-icons"
import {faGoogle as googleIcon} from "@fortawesome/free-brands-svg-icons"
import {setCookie} from './../Navigation/Cookie';

const SignIn = () => {
    const baseUrl = "http://ec2-52-78-218-238.ap-northeast-2.compute.amazonaws.com:8080";

    const navigate = useNavigate();
    const passwordRef = useRef(null);

    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [isLoginConfirmEffect, setIsLoginConfirmEffect] = useState(true);

    const [loginMemberEmail, setLoginMemberEmail] = useState("");
    const [loginMemberPassword, setLoginMemberPassword] = useState("");

    const [isLoginEmailCheckEffect, setIsLoginEmailCheckEffect] = useState(true);
    const [isLoginPasswordCheckEffect, setIsLoginPasswordCheckEffect] = useState(true);

    const onMemberEmailHandler = (e) => {
        setLoginMemberEmail(e.target.value);
    }

    const onMemberPasswordHandler = (e) => {
        setLoginMemberPassword(e.target.value);
    }

    const passwordSeeHandler = () => {
        const typeCheck = passwordRef.current.type;

        // eslint-disable-next-line eqeqeq
        if(typeCheck == 'password') {
            passwordRef.current.type = 'text';
        } else {
            passwordRef.current.type = 'password';
        }
    }

    const onLoginHandler = async () => {

        const loginBody = {
            memberEmail: loginMemberEmail,
            memberPw: loginMemberPassword
        }

        // eslint-disable-next-line
        const loginEmailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const loginPasswordRegex = /^(?=.*[a-zA-Z])(?=.*[!?@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

        if (!loginEmailRegex.test(loginMemberEmail) || loginMemberEmail.length < 1) {
            alert('이메일을 다시 확인해주세요.');
            setLoginErrorMessage('이메일을 다시 확인해주세요.');
            setIsLoginConfirmEffect(false);
            setIsLoginEmailCheckEffect(false);
        } else if (!loginPasswordRegex.test(loginMemberPassword) || loginMemberPassword.length < 1) {
            setIsLoginEmailCheckEffect(true);
            alert('비밀번호를 다시 확인해주세요.');
            setLoginErrorMessage('비밀번호를 다시 확인해주세요.');
            setIsLoginConfirmEffect(false);
            setIsLoginPasswordCheckEffect(false);
        } else {
            setLoginErrorMessage('');
            setIsLoginConfirmEffect(true);
            setIsLoginEmailCheckEffect(true);
            setIsLoginPasswordCheckEffect(true);

            await axios({
                method: "POST",
                url: "/member/signIn",
                data: JSON.stringify(loginBody),
                headers: {'Content-type': 'application/json'}
            }).then((response) => {
                const responseData = response.data;
                if(responseData.data) {
                    onLoginSuccess(responseData);

                    navigate('/');
                } else {
                    alert('로그인에 실패했습니다.');
                    setLoginErrorMessage('이메일이 존재하지 않거나 비밀번호가 일치하지 않습니다. 다시 시도해주세요.');
                    setIsLoginConfirmEffect(false);
                    setIsLoginEmailCheckEffect(false);
                    setIsLoginPasswordCheckEffect(false);
                }

            })
        }
    }

    // const onSilentRefresh = async () => {
    //
    //     let token = {
    //         accessToken: loginMemberEmail,
    //         refreshToken: loginMemberPassword
    //     }
    //
    //     await axios({
    //         method: "POST",
    //         url: "/auth/reissue",
    //         data: JSON.stringify(token),
    //         headers: {'Content-type': 'application/json'}
    //     }).then((response) => {
    //         const responseData = response.data;
    //         onLoginSuccess(responseData);
    //     })
    // }

    const onLoginSuccess = (response) => {
        const { grantType, accessToken, refreshToken, refreshTokenExpiresIn } = response.data;

        const expires = new Date(refreshTokenExpiresIn);
        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        axios.defaults.headers.common['Authorization'] = `${grantType} ${accessToken}`;

        setCookie('refreshToken', refreshToken, {
            path: '/',
            // httpOnly: true,
            expires
        });

        // accessToken을 localStorage, cookie 등에 저장하지 않는다!

        // accessToken 만료하기 1분 전에 로그인 연장
        // setTimeout(onSilentRefresh, accessTokenExpiresIn - 60000);
    }

    const enterOnKeyHandler = (e) => {
        // eslint-disable-next-line eqeqeq
        if(e.key == 'Enter') {
            onLoginHandler();
        }
    }

    return (
        <div className="signIn-body">
            <AppBarNavigation />

            <h1 style={{marginTop: '100px', fontWeight: 'bold'}}>
                <Link to="/" style={{textDecoration: 'none', color: 'white', fontFamily: 'YEONGJUPunggiGinsengTTF'}}>
                    <FontAwesomeIcon icon={logoIcon} style={{position: 'relative', top: '2px', fontSize: '60px'}}/>&nbsp; ReP
                </Link>
            </h1>

            <div className="signIn-view">

                <div className="common-signIn">
                    <h3>로그인</h3>
                    <div className="signIn-input">
                        <div className="signIn-email">
                            <input type="text" value={loginMemberEmail} onChange={onMemberEmailHandler} onKeyDown={enterOnKeyHandler}
                                    style={ isLoginEmailCheckEffect ? {border: '1px solid #6c757d'} : {border: '2px solid red'} } placeholder="이메일"/>
                        </div>
                        <div className="signIn-password">
                            <FontAwesomeIcon icon={passwordSeeIcon} onClick={() => passwordSeeHandler()} className="passwordSee-icon"/>
                            <input type="password" value={loginMemberPassword} onChange={onMemberPasswordHandler} onKeyDown={enterOnKeyHandler} ref={passwordRef}
                                   style={ isLoginPasswordCheckEffect ? {border: '1px solid #6c757d'} : {border: '2px solid red'} } placeholder="비밀번호"/>
                        </div>
                        {(
                            <div style={ isLoginConfirmEffect ? null : {color:'red', fontSize:'13px', marginTop:'10px', fontWeight:'bold'} }>{loginErrorMessage}</div>
                        )}
                    </div>
                    <div className="on-submit">
                        <div className="on-signIn">
                            <button onClick={onLoginHandler}>
                                로그인
                            </button>
                        </div>
                        <div className="on-signUp">
                            <Link to="/signUp">
                                <button>
                                    회원가입
                                </button>
                            </Link>
                        </div>
                        <div className="on-passwordFind">
                            <Link to="/findPasswordView" className="link-passwordFind">
                                비밀번호 찾기
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="middle-line">
                    <span className="custom-line1"></span>
                    OR
                    <span className="custom-line2"></span>
                </div>

                <div className="easy-signIn">
                    <div className="signIn-google">
                        <FontAwesomeIcon icon={googleIcon} className="google-icon" />
                        <button onClick={() => window.location.href=baseUrl + "/oauth2/authorization/google"}>구글 로그인</button>
                    </div>
                    <div className="signIn-kakao">
                        <FontAwesomeIcon icon={kakaoIcon} className="kakao-icon" />
                        <button onClick={() => window.location.href=baseUrl + "/oauth2/authorization/kakao"}>카카오 로그인</button>
                    </div>
                    <div className="signIn-naver">
                        <span className="naver-icon">N</span>
                        <button onClick={() => window.location.href=baseUrl + "/oauth2/authorization/naver"}>네이버 로그인</button>
                    </div>
                </div>

            </div>

            <FooterNavigation />
        </div>
    )
}

export default SignIn;