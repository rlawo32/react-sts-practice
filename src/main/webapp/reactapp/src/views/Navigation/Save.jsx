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
import {useLocation, useNavigate} from "react-router-dom";

const Save = () => {
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const props = useLocation().state;

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

    const categoryMenu = props.category_name;
    const tabMenu = props.subTab_name;

    const [boardCategory, setBoardCategory] = useState(categoryMenu[1].key);
    const [boardTab, setBoardTab] = useState(tabMenu[1].key);
    const [boardTitle, setBoardTitle] = useState("");
    const [boardContent, setBoardContent] = useState("");

    const boardCategoryChangeHandler = ({target: {value}}) => {
        setBoardCategory(value);
    }

    const boardTabChangeHandler = ({target: {value}}) => {
        setBoardTab(value);
    }

    const boardTitleChangeHandler = ({target: {value}}) => {
        setBoardTitle(value);
    }

    const boardContentChangeHandler = () => {
        setBoardContent(editorRef.current.getInstance().getMarkdown());
    }

    const saveBoard = async() => {

        const BoardData = {
            boardCategory: `${boardCategory}`,
            boardTab: `${boardTab}`,
            boardTitle: `${boardTitle}`,
            boardContent: `${boardContent}`
        }

        await axios({
            method: "POST",
            url: "board/boardSave",
            data: JSON.stringify(BoardData),
            headers: {'Content-type': 'application/json'}
        }).then((result) => {
            window.alert("등록이 완료되었습니다람쥐");
            navigate('/board');
        })
    }

    return (
        <div>
            <div style={ {marginBottom:"55px"} }><h1>게시글 등록</h1></div>
            <Container className="panel">
                <Form>
                    <Form.Group className="mb-3" controlId="boardSubject">
                        <Col sm>
                            <Form.Select value={boardCategory} onChange={boardCategoryChangeHandler}>
                                {categoryMenu.filter((cl) => (cl.key != "C0")).map((cl) => (
                                    <option key={cl.key} value={cl.key}>{cl.value}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="boardTab">
                        <Col sm>
                            <Form.Select value={boardTab} onChange={boardTabChangeHandler}>
                                {tabMenu.filter((tl) => (tl.key != "T0")).map((tl) => (
                                    <option key={tl.key} value={tl.key}>{tl.value}</option>
                                ))}
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
                                    plugins={[colorSyntax]} // 플러그인
                                    onChange={boardContentChangeHandler}
                                />
                            </Box>
                        </Col>
                    </Form.Group>

                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="primary" onClick={saveBoard}>등록</Button>
                    </div>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="secondary" href="/board">취소</Button>
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