import React, { useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from "axios";

const Save = () => {
    const accessToken = new URL(window.location.href).searchParams.get("accessToken");
    const refreshToken = new URL(window.location.href).searchParams.get("refreshToken");

    if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
    }

    //const baseUrl = "http://localhost:8080/";
    const [boardTab, setBoardTab] = useState("");
    const [boardTitle, setBoardTitle] = useState("");
    const [boardContent, setBoardContent] = useState("");
    const tab_menu = [''];

    const boardTabChangeHandler = ({target: {value}}) => {
        setBoardTab(value);
        console.log(boardTab);
    }

    const boardTitleChangeHandler = ({target: {value}}) => {
        setBoardTitle(value);
    }

    const boardContentChangeHandler = ({target: {value}}) => {
        setBoardContent(value);
    }

    const JsonData = {
        boardTab: `${boardTab}`,
        boardTitle: `${boardTitle}`,
        boardContent: `${boardContent}`
    }

    const submitHandler = async() => {
        console.log(JSON.stringify(JsonData))
        await axios({
            method: "POST",
            url: "/api/v1/boardInsert",
            data: JSON.stringify(JsonData),
            headers: {'Content-type': 'application/json'}
        }).then(function() {
            window.alert("등록이 완료되었습니다람쥐");
        }).catch(function(error) {
            console.log("에러내용:", JSON.stringify(error));
        })

    }

    return (
        <div>
            <div style={ {marginBottom:"55px"} }><h1>다른 페이지 게시글 등록</h1></div>
            <Container className="panel">
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="boardTab">
                        <Col sm>
                            <Form.Select value={boardTab} onChange={boardTabChangeHandler}>
                                <option>화제</option>
                                <option>정보</option>
                                <option>오류</option>
                                <option>사진/동영상</option>
                                <option>팁과 노하우</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boardTitle">
                        <Col sm>
                            <Form.Control type="title" placeholder="제목을 입력하세요" value={boardTitle} onChange={boardTitleChangeHandler}/>
                            <Form.Text className="text-muted"></Form.Text>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boardContent">
                        <Col sm>
                            <Form.Control as="textarea" rows={3} placeholder="내용을 입력하세요" value={boardContent} onChange={boardContentChangeHandler}/>
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
        </div>
    )
}

export default Save;