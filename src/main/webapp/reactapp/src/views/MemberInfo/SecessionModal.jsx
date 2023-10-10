import React, {useEffect, useRef, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {removeCookie} from "../Navigation/Cookie";

const SecessionModal = (props) => {
    const navigate = useNavigate();
    const modalRef = useRef();

    const [memberPassword, setMemberPassword] = useState("");

    const memberPasswordChangeHandler = (e) => {
        setMemberPassword(e.target.value);
    }

    const memberSecessionHandler = async () => {

        const memberData = {
            memberEmail: props.email,
            memberPw: memberPassword
        }

        if(memberPassword.length < 1) {
            alert('비밀번호를 입력해주시길 바랍니다.');
        } else {
            // eslint-disable-next-line eqeqeq
            if(window.confirm('정말 회원탈퇴를 진행하시겠습니까?') == true) {
                await axios({
                    method: 'PUT',
                    url: 'member/memberSecession',
                    data: JSON.stringify(memberData),
                    headers: {'Content-type': 'application/json'}
                }).then((res) => {
                    const result = res.data.result;

                    if(result) {
                        alert('탈퇴가 완료되었습니다.\n계정에서 로그아웃이 됩니다.');

                        removeCookie('refreshToken');
                        navigate("/");
                        window.location.reload();
                    } else {
                        alert('현재 비밀번호가 일치하지 않습니다.');
                    }
                })
            }
        }
    }

    useEffect( () => {
        const handler = (e) => {
            // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
            if (modalRef.current && (!modalRef.current.contains(e.target))) {
                props.setSecessionModal(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    })

    return (
        <div ref={modalRef} className="secessionModal-view">

            <h3>회원 탈퇴</h3>

            <p>
                현재 비밀번호를 정확히 입력해야 탈퇴가 진행됩니다. <br/>
                탈퇴하는 경우 일정 기간 또는 영구적으로 재가입이 제한됩니다. <br/>
                기존 글/댓글은 삭제되지 않으며, 타인 글로 간주하게 됩니다.
            </p>
            
            <div className="secession-input">
                <div className="secession-email">
                    <span className="secession-guide">
                        이메일
                    </span>
                    <input type="text" value={props.email} readOnly={true}/>
                </div>
                <div className="secession-password">
                    <span className="secession-guide">
                        비밀번호
                    </span>
                    <input type="password" value={memberPassword} onChange={memberPasswordChangeHandler}/>
                </div>
                <div className="secession-btn">
                    <button onClick={() => memberSecessionHandler()}>
                        탈퇴하기
                    </button>
                </div>
            </div>

        </div>
    )
}

export default SecessionModal;