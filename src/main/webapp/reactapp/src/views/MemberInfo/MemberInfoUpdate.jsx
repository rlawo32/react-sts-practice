import React, {useEffect, useRef, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil as pencil} from "@fortawesome/free-solid-svg-icons";
import memberDefaultImg from "../../images/userDefault.png";
import {useNavigate} from "react-router-dom";

const MemberInfoUpdate = (props) => {

    const profileInfo = props.info;
    const profileBirth = profileInfo.memberBirth;
    const navigate = useNavigate();

    const [previewProfileImg, setPreviewProfileImg] = useState(props.img);
    const [uploadProfileImg, setUploadProfileImg] = useState("");
    const [memberNickname, setMemberNickname] = useState(profileInfo.memberNickname);
    const [memberBirthY, setMemberBirthY] = useState(profileBirth.substring(0, 4));
    const [memberBirthM, setMemberBirthM] = useState(profileBirth.substring(4, 6));
    const [memberBirthD, setMemberBirthD] = useState(profileBirth.substring(6));

    const memberProfileImgChangeHandler = (e) => {
        const file = e.target.files[0];
        setUploadProfileImg(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewProfileImg(reader.result);
        }
    }

    const memberNicknameChangeHandler = (e) => {
        setMemberNickname(e.target.value);
    }

    const memberBirthYChangeHandler = (e) => {
        setMemberBirthY(e.target.value);
    }

    const memberBirthMChangeHandler = (e) => {
        setMemberBirthM(e.target.value);
    }

    const memberBirthDChangeHandler = (e) => {
        setMemberBirthD(e.target.value);
    }

    const updateData = {
        memberNickname: `${memberNickname}`,
        memberBirth: `${memberBirthY}` + "/" + `${memberBirthM}` + "/" + `${memberBirthD}`
    }

    const saveMemberInfo = async() => {
        const formData = new FormData();
        formData.append('multipartFile', uploadProfileImg);

        await axios({
            method: "PUT",
            url: "member/memberUpdate",
            params: updateData
        }).then((result) => {
            window.alert("등록이 완료되었습니다람쥐");
            navigate('/memberInfo');
        })

        await axios({
            method: "POST",
            url: "member/imageUpload",
            data: formData,
            contentType: false,
            processData: false,
            enctype: "multipart/form-data"
        }).then((result) => {
            window.alert("등록이 완료되었습니다람쥐");
            navigate('/memberInfo');
        })
    }

    useEffect(() => {

    }, [])

    return (
        <div className="member-info">

            <h3>내 정보 수정</h3>

            <div className="update-view">

                <div className="profile-picture">
                    <img src={previewProfileImg ? previewProfileImg : memberDefaultImg} alt="프로필 이미지" className="upload-picture"/>
                    <form>
                        <input type="file" id="profileImg" accept="image/*" onChange={memberProfileImgChangeHandler} style={{display: 'none'}} multiple/>
                        <label htmlFor="profileImg">
                            <div className="update-picture">
                                <FontAwesomeIcon icon={pencil} style={{color: 'white'}}/>
                            </div>
                        </label>
                    </form>
                </div>

                <div className="update-info">

                    <div className="update-key">
                        <div className="update-email">
                            이메일/아이디
                        </div>
                        <div className="update-nickname">
                            닉네임
                        </div>
                        <div className="update-birth">
                            생년월일
                        </div>
                    </div>
                    <div className="update-value">
                        <div className="update-email">
                            {profileInfo.memberEmail}
                        </div>
                        <div className="update-nickname">
                            <input type="text" value={memberNickname} onChange={memberNicknameChangeHandler} />
                            <p style={ {fontSize: "13px", marginTop: "7px", color: "#5c636a"} }>
                                최소 3자 이상 최대 20자 이하로 작성해주시기 바랍니다. <br />
                                닉네임에 띄어쓰기 혹은 특수문자를 사용하실 수 없습니다.
                            </p>
                        </div>
                        <div className="update-birth-input">
                            <input type="text" value={memberBirthY} className="update-birthY" onChange={memberBirthYChangeHandler} />
                            <select value={memberBirthM} className="update-birthM" onChange={memberBirthMChangeHandler}>
                                <option value="">월</option>
                                <option value="01">1</option>
                                <option value="02">2</option>
                                <option value="03">3</option>
                                <option value="04">4</option>
                                <option value="05">5</option>
                                <option value="06">6</option>
                                <option value="07">7</option>
                                <option value="08">8</option>
                                <option value="09">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                            <input type="text" value={memberBirthD} className="update-birthD" onChange={memberBirthDChangeHandler} />
                            <p style={ {fontSize: "13px", marginTop: "7px", color: "#5c636a"} }>
                                태어난 년도 4자리를 정확하게 입력하세요. <br />
                                태어난 월을 선택하세요. <br />
                                태어난 일(날짜) 2자리를 정확하게 입력하세요.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="profile-update">
                    <button onClick={() => saveMemberInfo()}>등록</button>
                </div>

            </div>
        </div>
    )
}

export default MemberInfoUpdate;