import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useCookies } from "react-cookie";

const googleOauthLogin = () => {
    window.location.href = `http://localhost:8080/oauth2/authorization/google`;
    // window.location.href = `/login/oauth2/code/google`;
}

const SignIn = () => {
    const [loginErrorMessage, setLoginErrorMessage] = useState("");
    const [isLoginConfirmEffect, setIsLoginConfirmEffect] = useState(false);

    const [loginUserEmail, setLoginUserEmail] = useState("");
    const [loginUserPw, setLoginUserPw] = useState("");

    const [cookies, setCookies] = useCookies();

    const onUserIdHandler = (e) => {
        setLoginUserEmail(e.target.value);
    }

    const onUserPwHandler = (e) => {
        setLoginUserPw(e.target.value);
    }

    const onLoginHandler = (e) => {
        e.preventDefault();
        let loginBody = {
            userEmail: loginUserEmail,
            userPw: loginUserPw
        }

        axios({
            method: "POST",
            url: "/users/signIn",
            data: JSON.stringify(loginBody),
            headers: {'Content-type': 'application/json'}
        }).then((response) => {
            const responseData = response.data;
            console.log(response.data);
            if(responseData.data) {
                // localStorage.setItem("users", JSON.stringify(response.data));

                const { token, exprTime, users } = responseData.data;
                console.log("token" + token);
                const expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds + exprTime);

                setCookies('token', token, {expires});


                // window.location.href = "/";
            } else {
                setIsLoginConfirmEffect(false);
                setLoginErrorMessage("ID가 존재하지 않거나 비밀번호가 일치하지 않습니다. 다시 시도해주세요.");
            }

        })
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
                            <Form.Control type="title" placeholder="아이디" value={loginUserEmail} onChange={onUserIdHandler}/>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="author">
                        <Col sm>
                            <Form.Control type="author" placeholder="비밀번호" value={loginUserPw} onChange={onUserPwHandler}/>
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