import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";

const handleTest = () => {

    const accessToken = new URL(window.location.href).searchParams.get("accessToken");
    const refreshToken = new URL(window.location.href).searchParams.get("refreshToken");

    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    let sendData = JSON.stringify({
        "userId": "testID",
        "userPw": "1234"
    });

    axios({
        method: "POST",
        url: '/axiosTest',
        data: sendData,
        // header에서 JSON 타입의 데이터라는 것을 명시
        headers: {'Content-type': 'application/json;charset=utf-8'}
    }).then((res)=>{
        alert("성공!!");
        // API로 부터 받은 데이터 출력
        console.log(res.data);
    }).catch(error=>{
        console.log("실패");
        console.log(error);
    });
}

const Save = () => {
    const navigate = useNavigate();
    const accessToken = new URL(window.location.href).searchParams.get("accessToken");
    const refreshToken = new URL(window.location.href).searchParams.get("refreshToken");

    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    //const baseUrl = "http://localhost:8080/";
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");

    const handleChangeT = ({target: {value}}) => {
        setTitle(value);
    }

    const handleChangeA = ({target: {value}}) => {
        setAuthor(value);
    }

    const handleChangeC = ({target: {value}}) => {
        setContent(value);
    }

    const JsonData = {
        title: `${title}`,
        author: `${author}`,
        content: `${content}`
    }

    const handleSubmit = () => {

        console.log(JSON.stringify(JsonData))
        axios({
            method: "POST",
            url: "/api/v1/posts",
            data: JSON.stringify(JsonData),
            headers: {'Content-type': 'application/json'}
        }).then(function() {
            window.alert("등록이 완료되었습니다람쥐");
            navigate(-1);
        }).catch(function(error) {
                console.log("에러내용:", JSON.stringify(error));
        })

    }

    console.log("현재 제목2" + title);
    console.log("현재 작성자2" + author);
    console.log("현재 내용2" + content);

    return (
        <div>
            <div style={ {marginBottom:"55px"} }><h1>다른 페이지 게시글 등록</h1></div>
            <Container className="panel">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Col sm>
                            <Form.Control type="title" placeholder="제목을 입력하세요" value={title} onChange={handleChangeT}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="author">
                        <Col sm>
                            <Form.Control type="author" placeholder="작성자를 입력하세요" value={author} onChange={handleChangeA}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="content">
                        <Col sm>
                            <Form.Control as="textarea" rows={3} placeholder="내용을 입력하세요" value={content} onChange={handleChangeC}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="primary" type="submit">등록</Button>
                    </div>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="secondary" href="/">취소</Button>
                    </div>
                </Form>
            </Container>
            <Button onClick={handleTest}>Test</Button>
        </div>
    )
}

export default Save;