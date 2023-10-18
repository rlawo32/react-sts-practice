import React, {useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import memberDefaultImg from "../../images/ProfileDefault.png";
import SecessionModal from "./SecessionModal";
import jwt_decode from "jwt-decode";
import {getCookie} from "../Navigation/Cookie";

const MemberInfoProfile = (props) => {
    const jwtDecode = jwt_decode(getCookie("refreshToken"));

    const [secessionModal, setSecessionModal] = useState(false);

    const profileInfo = props.info;
    const profileImg = props.img;

    return (
        <div className="member-info">

            <div className="profile-view">

                <h3>내 정보 보기</h3>

                <div className="profile-picture" onClick={() => props.setData(5)}>
                    <img src={profileImg ? profileImg : memberDefaultImg} alt="프로필 이미지" className="upload-picture"/>
                </div>

                <div className="profile-info">

                    <div className="profile-key">
                        <div className="profile-email">
                            이메일/아이디
                        </div>
                        <div className="profile-nickname">
                            닉네임
                        </div>
                        <div className="profile-birth">
                            생년월일
                        </div>
                        <div className="profile-joinDate">
                            가입일
                        </div>
                        <div className="profile-lastLog">
                            최근 로그인
                        </div>
                    </div>
                    <div className="profile-value">
                        {
                            // eslint-disable-next-line eqeqeq
                            `${profileInfo.memberEmail}` != '' ?
                                <div className="profile-email font-custom">
                                    {profileInfo.memberEmail}
                                </div>
                                :
                                <div className="profile-email font-custom" style={{visibility: 'hidden'}}>
                                    NONE
                                </div>
                        }
                        <div className="profile-nickname font-custom">
                            {profileInfo.memberNickname}
                        </div>
                        {
                            // eslint-disable-next-line eqeqeq
                            `${profileInfo.memberBirth}` != '' ?
                                <div className="profile-birth font-custom">
                                    {profileInfo.memberBirth}
                                </div>
                                :
                                <div className="profile-birth font-custom" style={{visibility: 'hidden'}}>
                                    NONE
                                </div>
                        }
                        <div className="profile-joinDate font-custom">
                            {props.date}
                        </div>
                        <div className="profile-lastLog font-custom">
                            {profileInfo.recentLogDate}
                        </div>
                    </div>
                </div>

                {
                    jwtDecode.auth === 'ROLE_SOCIAL' ?
                        <div className="profile-update">
                            {secessionModal ? <SecessionModal setSecessionModal={setSecessionModal} email={profileInfo.memberEmail}/> : null}
                        </div>
                        :
                        <div className="profile-update">
                            <button onClick={() => props.setData(5)}>프로필 수정</button>
                            <button onClick={() => props.setData(6)}>비밀번호 변경</button>
                            <button onClick={() => setSecessionModal(true)}>회원 탈퇴</button>
                            {secessionModal ? <SecessionModal setSecessionModal={setSecessionModal} email={profileInfo.memberEmail}/> : null}
                        </div>
                }

            </div>

        </div>
    )
}

export default MemberInfoProfile;