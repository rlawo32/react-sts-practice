import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import { Editor } from '@toast-ui/react-editor';
import Box from "@mui/material/Box";
import React, {useRef, useState} from "react";
import Button from "react-bootstrap/Button";

const ToastEditor = () => {

    const editorRef = useRef(null);
    const [boardContent, setBoardContent] = useState("");
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

    const boardContentChangeHandler = () => {
        setBoardContent(editorRef.current.getInstance().getMarkdown());
    }

    return (
        <div>
            <Box>
                <Editor
                    ref={editorRef}
                    height="300px"
                    initialValue={boardContent}
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
            <div className="d-grid gap-1" style={ {margin:"5px"} }>
                <Button variant="secondary" onClick={editorSaveHandler}>테스트</Button>
            </div>
        </div>
    )
}

export default ToastEditor;