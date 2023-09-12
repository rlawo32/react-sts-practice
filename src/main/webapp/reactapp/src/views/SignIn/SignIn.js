import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import cookie from "react-cookies";
import { Cookies } from "react-cookie";
import {useNavigate} from "react-router-dom";

const googleOauthLogin = () => {
    window.location.href = `http://localhost:8080/oauth2/authorization/google`;
    // window.location.href = `/login/oauth2/code/google`;
}

const SignIn = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [isLoginConfirmEffect, setIsLoginConfirmEffect] = useState(false);

    const [loginMemberEmail, setLoginMemberEmail] = useState("");
    const [loginMemberPw, setLoginMemberPw] = useState("");

    const onMemberEmailHandler = (e) => {
        setLoginMemberEmail(e.target.value);
    }

    const onMemberPwHandler = (e) => {
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

        console.log(response.data);

        console.log(response.data.accessToken);
        console.log(response.data.refreshToken);

        const { grantType, accessToken, refreshToken, accessTokenExpiresIn} = response.data;

        console.log(accessToken);
        console.log(refreshToken);
        console.log(accessTokenExpiresIn);

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
        <div>
            <div style={ {marginBottom:"55px"} }><h1>간편 로그인</h1></div>
            <div>
                <Button onClick={googleOauthLogin}>구글 로그인</Button>
            </div>
            <div>
                <Button onClick={googleOauthLogin}>네이버 로그인</Button>
            </div>
            <div>
                <Button onClick={googleOauthLogin}>카카오 로그인</Button>
            </div>
            {/*<div>*/}
            {/*    <Button onClick={localStorage.clear()}>로컬 초기화</Button>*/}
            {/*</div>*/}

            <div style={ {marginBottom:"55px"} }><h1>일반 로그인</h1></div>
            <Container className="panel">
                <Form onSubmit={onLoginHandler}>
                    <Form.Group className="mb-3" controlId="title">
                        <Col sm>
                            <Form.Control type="title" placeholder="아이디" value={loginMemberEmail} onChange={onMemberEmailHandler}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="author">
                        <Col sm>
                            <Form.Control type="author" placeholder="비밀번호" value={loginMemberPw} onChange={onMemberPwHandler}/>
                        </Col>
                        {(
                            <span style={ isLoginConfirmEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{loginErrorMessage}</span>
                        )}
                    </Form.Group>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="primary" type="submit">로그인</Button>
                    </div>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="primary" href="/signUp">회원가입</Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default SignIn;