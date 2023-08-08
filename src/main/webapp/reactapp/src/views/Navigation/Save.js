import React, {useEffect, useState, useRef} from "react";
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Editor } from '@toast-ui/react-editor';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Box from '@mui/material/Box';
import axios from "axios";

const Save = () => {
    const editorRef = useRef(null);

    const editorSaveHandler = () => {
        let markDownContent = editorRef.current.getInstance().getMarkdown();
        let htmlContent = editorRef.current.getInstance().getHTML();

        console.log(markDownContent);
        console.log("================================");
        console.log(htmlContent);
    }

    const colorSyntaxOptions = {
        preset: [
            "#333333", "#666666", "#FFFFFF", "#EE2323", "#F89009", "#009A87", "#006DD7", "#8A3DB6",
            "#781B33", "#5733B1", "#953B34", "#FFC1C8", "#FFC9AF", "#9FEEC3", "#99CEFA", "#C1BEF9",
        ],
    };

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
                            {/*<Form.Control as="textarea" rows={3} placeholder="내용을 입력하세요" value={boardContent} onChange={boardContentChangeHandler}/>*/}
                            {/*<Form.Text className="text-muted"></Form.Text>*/}
                            <Box>
                                <Editor
                                    ref={editorRef}
                                    height="300px"
                                    initialValue="내용을 입력하세요."
                                    previewStyle="vertical" // or "tab"
                                    initialEditType="wysiwyg" // or "markdown"
                                    // hideModeSwitch={true} // wysiwyg markdown 전환 버튼 숨기기
                                    toolbarItems={[ // 툴바 옵션 설정
                                        ["heading", "bold", "italic", "strike"],
                                        ["hr", "quote"],
                                        ["table", "image", "link"],
                                        ["code", "codeblock"]
                                    ]}
                                    theme="dark" // dark 모드
                                    usageStatistics={false} // 구글 통계 수집 거부
                                    plugins={[[colorSyntax, colorSyntaxOptions]]} // 플러그인
                                />
                            </Box>
                        </Col>
                    </Form.Group>

                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="primary" type="submit">등록</Button>
                    </div>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="secondary" href="/">취소</Button>
                    </div>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="secondary" onClick={editorSaveHandler}>테스트</Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default Save;