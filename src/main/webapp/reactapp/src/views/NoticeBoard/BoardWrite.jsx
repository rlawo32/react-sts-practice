import React, {useEffect, useMemo, useRef, useState} from "react";
import '../NoticeBoard/BoardWrite.scss';
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleXmark as attachDelete} from "@fortawesome/free-solid-svg-icons"
import {Link, useLocation, useNavigate} from "react-router-dom";
import AppBarNavigation from "../Navigation/HeaderNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import ReactQuill from "react-quill";
import CustomQuillToolbar from "./CustomQuillToolbar";
import 'react-quill/dist/quill.snow.css';

const BoardWrite = () => {
    const quillRef = useRef(null);
    const navigate = useNavigate();
    const props = useLocation().state;

    const categoryMenu = props.category_name;
    const tabMenu = props.subTab_name;

    const [componentTitle, setComponentTitle] = useState("");
    const [boardCategory, setBoardCategory] = useState("");
    const [boardTab, setBoardTab] = useState("");
    const [boardTitle, setBoardTitle] = useState("");
    const [boardContent, setBoardContent] = useState("");
    const [boardContentImage, setBoardContentImage] = useState([]);

    const [previewWriteImgUrlArr, setPreviewWriteImgUrlArr] = useState([]);
    const [previewWriteImgNameArr, setPreviewWriteImgNameArr] = useState([]);  // imgName 성공시 삭제
    const [previewWriteImgSize, setPreviewWriteImgSize] = useState(0);
    const [attachImageArr, setAttachImageArr] = useState([]);
    const [removeImageArr, setRemoveImageArr] = useState([]); // db image 삭제
    const [selectRemoveImageArr, setSelectRemoveImageArr] = useState([]); // local image 삭제

    const boardCategoryChangeHandler = ({target: {value}}) => {
        setBoardCategory(value);
    }

    const boardTabChangeHandler = ({target: {value}}) => {
        setBoardTab(value);
    }

    const boardTitleChangeHandler = ({target: {value}}) => {
        setBoardTitle(value);
    }

    const boardWrite = async() => {

        const attachArr = [];
        for(let i=0; i<attachImageArr.length; i++) {
            attachArr[i] = attachImageArr[i];
        }

        if (props.boardDetail) {
            const removeArr = [];
            const selectRemoveArr = [];

            for(let i=0; i<removeImageArr.length; i++) {
                removeArr[i] = removeImageArr[i];
            }
            for(let i=0; i<selectRemoveImageArr.length; i++) {
                selectRemoveArr[i] = selectRemoveImageArr[i];
            }

            const BoardData = {
                boardCategory: `${boardCategory}`,
                boardTab: `${boardTab}`,
                boardTitle: `${boardTitle}`,
                boardContent: `${boardContent}`,
                boardImage: attachArr,
                deleteImage: removeArr,
                selectDeleteImage: selectRemoveArr
            }

            await axios({
                method: "PUT",
                url: "board/boardUpdate/" + props.boardDetail.boardId,
                data: JSON.stringify(BoardData),
                headers: {'Content-type': 'application/json'}
            }).then((result) => {
                window.alert("수정이 완료되었습니다.");
                navigate(-1);
            })
        } else {
            const BoardData = {
                boardCategory: `${boardCategory}`,
                boardTab: `${boardTab}`,
                boardTitle: `${boardTitle}`,
                boardContent: `${boardContent}`,
                boardImage: attachArr
            }

            await axios({
                method: "POST",
                url: "board/boardSave",
                data: JSON.stringify(BoardData),
                headers: {'Content-type': 'application/json'}
            }).then((result) => {
                window.alert("등록이 완료되었습니다.");
                navigate('/board');
            })
        }
    }

    const attachImageDelete = async (url, idx) => {
        let removeImgSize = 0;
        let removeImgName = "";
        for(let i=0; i<attachImageArr.length; i++) {
            if(attachImageArr[i].imgUrl == url) {
                removeImgSize = attachImageArr[i].imgSize;
                removeImgName = attachImageArr[i].imgName;
            }
        }
        setPreviewWriteImgUrlArr(previewWriteImgUrlArr.filter((value,index) => value !== url));
        setPreviewWriteImgSize(previewWriteImgSize - removeImgSize);
        setAttachImageArr(attachImageArr.filter((value,index) => value.imgUrl !== url))

        const removeImg = document.querySelector('img[src="'+ url + '"]');

        removeImg.remove();

        if(props.boardDetail) {
            setSelectRemoveImageArr(prevList => [...prevList, removeImgName]);
        } else {
            await axios({
                method: "DELETE",
                url: '/board/boardImageDelete',
                params: {imageFileName: removeImgName}
            })
        }

        // const removeIndex = previewWriteImgArr[e].lastIndexOf("/");
        // const removeUrl = previewWriteImgArr[e].substring(removeIndex+1);

        // const removeImgName = previewWriteImgNameArr[idx]; // imgName 성공시 삭제


        // setPreviewWriteImgNameArr(previewWriteImgNameArr.filter((value,index) => index !== e)); // imgName 성공시 삭제
    }

    const attachImageArray = () => {
        let result = [];
        for (let i=0; i<previewWriteImgUrlArr.length; i++) {
            result.push(
                <span key={i} className="write-attach">
                    <img key={i} src={previewWriteImgUrlArr[i]} alt="업로드 이미지" className="write-attach-upload" />
                    <FontAwesomeIcon icon={attachDelete} onClick={(e) =>
                        attachImageDelete(previewWriteImgUrlArr[i], i)} className="write-attach-delete"/>
                </span>);
        }
        return result;
    }

    const attachImageSize = () => {
        let result = "";
        let sizeName = ["KB", "MB"];

        let imageSize = previewWriteImgSize / 1024;

        if(imageSize.toFixed(1) < 1000) {
            result = imageSize.toFixed(1) + sizeName[0];
        } else {
            imageSize = imageSize / 1024;
            result = imageSize.toFixed(2) + sizeName[1];
        }

        return result;
    }

    const changeImageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/jpg,image/png,image/jpeg,image/gif");
        input.setAttribute("multiple", "multiple");

        input.click();

        input.onchange = async () => {
            const file = input.files;
            const editor = quillRef.current.getEditor();
            const range = editor.getSelection();

            let fileSize = 0;

            for(let i=0; i<file.length; i++) {
                fileSize += file[i].size;

                const formData = new FormData();

                formData.append('files', file[i]);

                await axios({
                    method: "POST",
                    url: "board/boardImageSave",
                    data: formData,
                    contentType: false,
                    processData: false,
                    enctype: "multipart/form-data"
                }).then((res) => {
                    // const result = "/upload/" + res.data.data;
                    const imgFileName = res.data.data.imgName;
                    const imgFileUrl = res.data.data.imgUrl;
                    setPreviewWriteImgUrlArr(prevList => [...prevList, imgFileUrl]);
                    setPreviewWriteImgNameArr(prevList => [...prevList, imgFileName]); // imgName 성공시 삭제
                    setAttachImageArr(prevList => [...prevList, { imgName:imgFileName, imgUrl:imgFileUrl, imgSize:file[i].size }]);
                    editor.insertEmbed(range.index, 'image', imgFileUrl);
                    editor.setSelection(range.index + 1);
                })

            }
            setPreviewWriteImgSize(prevList => prevList + fileSize);
        }
    }

    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "align",
        "strike",
        "script",
        "blockquote",
        "background",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "color",
        "code-block",
    ];

    const modules = useMemo(() => ({
        toolbar: {
            // container: [
            //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            //     [{ 'font': [] }],
            //     [{ 'align': [] }],
            //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            //     [{ 'list': 'ordered' }, { 'list': 'bullet' }, 'link'],
            //     [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }],
            //     ['image'],
            // ],
            container: "#toolbar" ,
            handlers: {
                image: changeImageHandler
            }
        },
    }), []);

    useEffect(() => {
        if(props.boardDetail) {
            setComponentTitle("수정");
            setBoardCategory(props.boardDetail.boardCategory);
            setBoardTab(props.boardDetail.boardTab);
            setBoardTitle(props.boardDetail.boardTitle);
            setBoardContent(props.boardDetail.boardContent);
            const boardImgList = props.boardDetail.boardImageList;

            let boardImgSize = 0;

            for(let i=0; i<boardImgList.length; i++) {
                setPreviewWriteImgUrlArr(prevList => [...prevList, boardImgList[i].boardImageUrlName]);
                setAttachImageArr(prevList => [...prevList, { imgName:boardImgList[i].boardImageCustomName, imgUrl:boardImgList[i].boardImageUrlName, imgSize:boardImgList[i].boardImageSize }]);
                setRemoveImageArr(prevList => [...prevList, boardImgList[i].boardImageCustomName]);
                boardImgSize += boardImgList[i].boardImageSize;
            }

            setPreviewWriteImgSize(boardImgSize);
        } else {
            setComponentTitle("등록");
            setBoardCategory(categoryMenu[1].key);
            setBoardTab(tabMenu[1].key);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="write-body">
            <AppBarNavigation />

            <div className="write-view" style={ previewWriteImgUrlArr.length > 0 ? {height: '1120px'} : {height: '980px'} }>
                <h3>게시글 {componentTitle}</h3>

                <div className="write-header">
                    <div className="write-category">
                        <div className="write-guide">
                            카테고리 선택
                        </div>
                        <div>
                            <select value={boardCategory} onChange={boardCategoryChangeHandler}>
                                {categoryMenu.filter((cl) => (cl.key !== "C0")).map((cl) => (
                                    <option key={cl.key} value={cl.key}>{cl.value}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="write-tab">
                        <div className="write-guide">
                            분류 선택
                        </div>
                        <select value={boardTab} onChange={boardTabChangeHandler}>
                            {tabMenu.filter((tl) => (tl.key !== "T0")).map((tl) => (
                                <option key={tl.key} value={tl.key}>{tl.value}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="write-title">
                    <div className="write-guide">
                        제목
                    </div>
                    <input type="text" value={boardTitle} onChange={boardTitleChangeHandler} placeholder="제목을 입력하세요"/>
                </div>

                <div className="write-content">
                    <div className="write-guide">
                        내용
                    </div>

                    <CustomQuillToolbar />
                    <div>
                        <ReactQuill
                            id="quillContent"
                            ref={quillRef}
                            style={{ height: "450px", backgroundColor: "#6c757d" }}
                            placeholder="Quill Content"
                            theme="snow"
                            modules={modules}
                            formats={formats}
                            onChange={setBoardContent}
                            value={boardContent}
                        />
                    </div>
                </div>

                <div className="write-image-attach" style={ previewWriteImgUrlArr.length > 0 ? {display: 'block'} : {display: 'none'} }>
                    <div className="write-image-attach-header">
                        <span>이미지 첨부</span>
                        <span style={{marginLeft: '10px'}}>{attachImageArray().length} 개</span>
                        <span style={{marginLeft: '10px'}}>({attachImageSize()} / 50.00MB)</span>
                    </div>
                    <div className="write-image-attach-body">
                        {attachImageArray()}
                    </div>
                </div>

                <div className="on-submit">
                    <div className="on-cancel">
                        <Link to="/board">
                            <button>
                                돌아가기
                            </button>
                        </Link>
                    </div>
                    <div className="on-preview">
                        <button>
                            미리보기
                        </button>
                    </div>
                    <div className="on-write">
                        <button onClick={boardWrite}>{componentTitle}</button>
                    </div>
                </div>

            </div>

            <FooterNavigation />
        </div>
    )
}

export default BoardWrite;