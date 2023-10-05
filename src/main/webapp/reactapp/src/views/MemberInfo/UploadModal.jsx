import React, {useEffect, useRef} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'

const UploadModal = (props) => {
    const modalRef = useRef();

    const memberProfileImgChangeHandler = (e) => {
        const file = e.target.files[0];
        props.setUploadProfileImg(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            props.setPreviewProfileImg(reader.result);
            props.setUploadModal(false);
        }
    }

    const memberProfileImgRemoveHandler = () => {
        props.setPreviewProfileImg("");
        props.setUploadProfileImg("D");
        props.setUploadModal(false);
    }

    useEffect( () => {

        const handler = (e) => {
            // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
            if (modalRef.current && (!modalRef.current.contains(e.target))) {
                props.setUploadModal(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    })

    return (
        <div ref={modalRef} className="uploadModal-view">
            <div className="upload-delete">
                <button onClick={() => memberProfileImgRemoveHandler()}>
                    이미지 삭제
                </button>
            </div>
            <form className="upload-update">
                <input type="file" id="profileImg" accept="image/*" onChange={memberProfileImgChangeHandler} style={{display: "none"}} multiple/>
                <label htmlFor="profileImg" style={{cursor: 'pointer'}}>
                    이미지 업로드
                </label>
            </form>
        </div>
    )
}

export default UploadModal;