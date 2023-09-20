import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import memberDefaultImg from "../../images/ProfileDefault.png";

const MemberInfoProfile = (props) => {

    const profileInfo = props.info;
    const profileImg = props.img;

    return (
        <div className="member-info">

            <h3>내 정보 확인</h3>

            <div className="profile-view">

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
                        <div className="profile-email">
                            {profileInfo.memberEmail}
                        </div>
                        <div className="profile-nickname">
                            {profileInfo.memberNickname}
                        </div>
                        <div className="profile-birth">
                            {profileInfo.memberBirth}
                        </div>
                        <div className="profile-joinDate">
                            {props.date}
                        </div>
                        <div className="profile-lastLog">
                            {profileInfo.recentLogDate}
                        </div>
                    </div>
                </div>

                <div className="profile-update">
                    <button onClick={() => props.setData(5)}>프로필 수정</button>
                    <button onClick={() => props.setData(6)}>비밀번호 변경</button>
                </div>

            </div>

        </div>
    )
}

export default MemberInfoProfile;