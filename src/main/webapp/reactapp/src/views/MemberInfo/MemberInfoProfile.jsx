import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import memberDefaultImg from "../../images/userDefault.png";

const MemberInfoProfile = (props) => {

    const [memberProfileImg, setMemberProfileImg] = useState("");

    const profileInfo = props.info;
    const profileImage = profileInfo.picture;
    const uploadFolder = "C:/upload/";

    useEffect(() => {
        console.log(profileImage);
    }, [])

    return (
        <div className="member-info">

            <h3>내 정보 확인</h3>

            <div className="profile-view">

                <div className="profile-picture" onClick={() => props.setData(4)}>
                    <img src={profileImage ? profileImage : memberDefaultImg} alt="프로필 이미지" className="upload-picture"/>
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
                            {profileInfo.createdDate}
                        </div>
                        <div className="profile-lastLog">
                            {profileInfo.createdDate}
                        </div>
                    </div>
                </div>

                <div className="profile-update">
                    <button onClick={() => props.setData(4)}>수정</button>
                </div>

            </div>

        </div>
    )
}

export default MemberInfoProfile;