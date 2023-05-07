import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [userPwChk, setUserPwChk] = useState("");
    const [userName, setUserName] = useState("");
    const [userBirth, setUserBirth] = useState("");
    const [userGender, setUserGender] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPhone, setUserPhone] = useState("");

    const signUpChangeId = ({target: {value}}) => {
        setUserId(value);
    }

    const signUpChangePw = ({target: {value}}) => {
        setUserPw(value);
    }

    const signUpChangePc = ({target: {value}}) => {
        setUserPwChk(value);
    }

    const signUpChangeNm = ({target: {value}}) => {
        setUserName(value);
    }

    const signUpChangeBr = ({target: {value}}) => {
        setUserBirth(value);
    }

    const signUpChangeGe = ({target: {value}}) => {
        setUserGender(value);
    }

    const signUpChangeEm = ({target: {value}}) => {
        setUserEmail(value);
    }

    const signUpChangePh = ({target: {value}}) => {
        setUserPhone(value);
    }

    const userData = {
        userId: `${userId}`,
        userPw: `${userPw}`,
        userPwChk: `${userPwChk}`,
        userName: `${userName}`,
        userBirth: `${userBirth}`,
        userGender: `${userGender}`,
        userEmail: `${userEmail}`,
        userPhone: `${userPhone}`
    }
    const handleJoin = () => {

        console.log(JSON.stringify(userData))
        // axios({
        //     method: "POST",
        //     url: "/api/v1/posts",
        //     data: JSON.stringify(userData),
        //     headers: {'Content-type': 'application/json'}
        // }).then(function() {
        //     window.alert("회원가입이 완료되었습니다람쥐");
        //     navigate(-1);
        // }).catch(function(error) {
        //         console.log("에러내용:", JSON.stringify(error));
        // })

    }

    return (
        <div>
            <div style={ {marginBottom:"55px"} }><h1>회원 가입</h1></div>
            <Container className="panel">
                <Form onSubmit={handleJoin}>
                    <Form.Group className="mb-3" controlId="userId">
                        <Col sm>
                            <Form.Control type="userId" placeholder="아이디를 입력하세요" value={userId} onChange={signUpChangeId}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userPw">
                        <Col sm>
                            <Form.Control type="password" placeholder="비밀번호를 입력하세요" value={userPw} onChange={signUpChangePw}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userPwChk">
                        <Col sm>
                            <Form.Control type="password" placeholder="비밀번호 확인" value={userPwChk} onChange={signUpChangePc}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userName">
                        <Col sm>
                            <Form.Control type="userName" placeholder="이름을 입력하세요" value={userName} onChange={signUpChangeNm}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userBirth">
                        <Col sm>
                            <Form.Control type="userBirth" placeholder="생일을 입력하세요" value={userBirth} onChange={signUpChangeBr}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userGender">
                        <Col sm>
                            <Form.Control type="userGender" placeholder="성별을 입력하세요" value={userGender} onChange={signUpChangeGe}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userEmail">
                        <Col sm>
                            <Form.Control type="userEmail" placeholder="이메일을 입력하세요" value={userEmail} onChange={signUpChangeEm}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userPhone">
                        <Col sm>
                            <Form.Control type="userPhone" placeholder="휴대폰 번호를 입력하세요" value={userPhone} onChange={signUpChangePh}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="primary" type="submit">회원가입</Button>
                    </div>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="secondary" href="/">취소</Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default SignUp;