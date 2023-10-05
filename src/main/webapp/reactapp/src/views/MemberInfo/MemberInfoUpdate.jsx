import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil as pencil} from "@fortawesome/free-solid-svg-icons";
import memberDefaultImg from "../../images/ProfileDefault.png";
import UploadModal from "./UploadModal";
import {useNavigate} from "react-router-dom";

const MemberInfoUpdate = (props) => {

    const profileInfo = props.info;
    const profileBirth = profileInfo.memberBirth;
    const navigate = useNavigate();

    const [previewProfileImg, setPreviewProfileImg] = useState("");
    const [uploadProfileImg, setUploadProfileImg] = useState("");

    const [memberNickname, setMemberNickname] = useState(profileInfo.memberNickname);
    const [memberBirthY, setMemberBirthY] = useState(profileBirth.substring(0, 4));
    const [memberBirthM, setMemberBirthM] = useState(profileBirth.substring(5, 7));
    const [memberBirthD, setMemberBirthD] = useState(profileBirth.substring(8));
    const [pwDuplicationCheck, setPwDuplicationCheck] = useState("");

    const [isNicknameEffect, setIsNicknameEffect] = useState(true);
    const [isBirthYEffect, setIsBirthYEffect] = useState(true);
    const [isBirthMEffect, setIsBirthMEffect] = useState(true);
    const [isBirthDEffect, setIsBirthDEffect] = useState(true);
    const [isPwChkEffect, setIsPwChkEffect] = useState(true);

    const [nicknameMessage, setNicknameMessage] = useState("");
    const [birthYMessage, setBirthYMessage] = useState("");
    const [birthMMessage, setBirthMMessage] = useState("");
    const [birthDMessage, setBirthDMessage] = useState("");
    const [pwChkMessage, setPwChkMessage] = useState("");

    const [uploadModal, setUploadModal] = useState(false);

    const nickNameDuplicationChk = async (changeNickname) => {
        await axios({
            method: "GET",
            url: "/member/signUpDuplicationChk",
            params: {memberEmail: profileInfo.memberEmail, memberNickname: changeNickname}
        }).then((res) => {
            console.log("제대로 되나..? " + res.data);
            if(res.data) {
                setNicknameMessage('이미 사용중인 닉네임입니다.');
                setIsNicknameEffect(false);
            } else {
                setNicknameMessage('');
                setIsNicknameEffect(true);
            }

        })
    }

    const passwordDuplicationChk = async() => {
        await axios({
            method: "GET",
            url: "member/passwordDuplicationChk",
            params: {passwordCheck: pwDuplicationCheck}
        }).then((res) => {
            saveMemberInfo(res.data);
        })
    }

    const memberNicknameChangeHandler = (e) => {
        const changeNickname = e.target.value;
        const nicknameRegex = /^.{2,20}$/;
        const specialRegex  = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
        const gapRegex  = /\s/g;

        if (changeNickname.length < 1) {
            setNicknameMessage('필수 정보입니다.');
            setIsNicknameEffect(false);
        } else {
            if (!nicknameRegex.test(changeNickname)) {
                // setUserNameMessage('한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)');
                setNicknameMessage('최소 2자 이상 최대 20자 이하로 작성해주시기 바랍니다.');
                setIsNicknameEffect(false);
            } else {
                if(specialRegex.test(changeNickname) || gapRegex.test(changeNickname)) {
                    setNicknameMessage('닉네임에 띄어쓰기 혹은 특수문자를 사용하실 수 없습니다.');
                    setIsNicknameEffect(false);
                } else {
                    setNicknameMessage('');
                    setIsNicknameEffect(true);
                    nickNameDuplicationChk(changeNickname);
                }
            }
        }

        setMemberNickname(changeNickname);
    }

    const memberBirthYChangeHandler = (e) => {
        const changeBirthY = e.target.value;
        const birthYRegex = /^(19[0-9][0-9]|20\d{2})$/;

        if(changeBirthY.length < 1) {
            setBirthYMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsBirthYEffect(false);
        } else {
            if (!birthYRegex.test(changeBirthY)) {
                setBirthYMessage('태어난 년도 4자리를 정확하게 입력하세요.');
                setIsBirthYEffect(false);
            } else {
                setBirthYMessage('');
                setIsBirthYEffect(true);
            }
        }

        setMemberBirthY(changeBirthY);
    }

    const memberBirthMChangeHandler = (e) => {
        const changeBirthM = e.target.value;
        const birthMRegex = /^(0[0-9]|1[0-2])$/;

        if(changeBirthM.length < 1) {
            setBirthMMessage('태어난 월을 선택하세요.');
            setIsBirthMEffect(false);
        } else {
            if (!birthMRegex.test(changeBirthM)) {
                setBirthMMessage('태어난 월을 선택하세요.');
                setIsBirthMEffect(false);
            } else {
                setBirthMMessage('');
                setIsBirthMEffect(true);
            }
        }

        setMemberBirthM(changeBirthM);
    }

    const memberBirthDChangeHandler = (e) => {
        const changeBirthD = e.target.value;
        const birthDRegex = /^([1-9]|[1-2][0-9]|3[0-1])$/;

        if(changeBirthD.length < 1) {
            setBirthDMessage('태어난 일(날짜) 2자리를 정확하게 입력하세요.');
            setIsBirthDEffect(false);
        } else {
            if (!birthDRegex.test(changeBirthD)) {
                setBirthDMessage('태어난 일(날짜) 2자리를 정확하게 입력하세요.');
                setIsBirthDEffect(false);
            } else {
                setBirthDMessage('');
                setIsBirthDEffect(true);
            }
        }

        setMemberBirthD(changeBirthD);
    }

    const memberPwCheckChangeHandler = (e) => {
        const changePwCheck = e.target.value;
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

        if (changePwCheck.length < 1) {
            setPwChkMessage('필수 정보입니다.');
            setIsPwChkEffect(false);
        } else {
            if (!passwordRegex.test(changePwCheck)) {
                setPwChkMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
                setIsPwChkEffect(false);
            } else {
                setPwChkMessage('');
                setIsPwChkEffect(true);
            }
        }

        setPwDuplicationCheck(changePwCheck);
    }

    const saveMemberInfo = async(passwordCheck) => {

        const updateData = {
            memberNickname: `${memberNickname}`,
            memberBirth: `${memberBirthY}` + "/" + `${memberBirthM}` + "/" + `${memberBirthD}`
        }

        const formData = new FormData();

        if(passwordCheck) {

            if(uploadProfileImg == "D") {
                await axios({
                    method: "DELETE",
                    url: "member/imageDelete"
                })
            } else {
                formData.append('multipartFile', uploadProfileImg);
                if(uploadProfileImg) {
                    await axios({
                        method: "POST",
                        url: "member/imageUpload",
                        data: formData,
                        contentType: false,
                        processData: false,
                        enctype: "multipart/form-data"
                    })
                }
            }

            if(isNicknameEffect && isBirthYEffect && isBirthMEffect && isBirthDEffect) {
                await axios({
                    method: "PUT",
                    url: "member/memberUpdate",
                    params: updateData
                }).then((res) => {
                    window.alert("등록이 완료되었습니다람쥐");
                    props.setData(true);
                    navigate(-1);
                })
            } else {
                if(!isNicknameEffect) {
                    alert("닉네임이 잘못 입력되었습니다.");
                    setNicknameMessage('조건에 맞게 닉네임을 작성해주시길 바랍니다.');
                    setIsNicknameEffect(false);
                }
                if(!isBirthYEffect) {
                    alert("태어난 년도가 잘못 입력되었습니다.");
                    setBirthYMessage('태어난 년도 4자리를 정확하게 입력하세요.');
                    setIsBirthYEffect(false);
                }
                if(!isBirthMEffect) {
                    alert("태어난 월이 잘못 입력되었습니다.");
                    setBirthMMessage('태어난 월을 선택하세요.');
                    setIsBirthMEffect(false);
                }
                if(!isBirthDEffect) {
                    alert("태어난 날짜가 잘못 입력되었습니다.");
                    setBirthDMessage('태어난 일(날짜) 2자리를 정확하게 입력하세요.');
                    setIsBirthDEffect(false);
                }
            }
        } else {
            alert("현재 비밀번호를 정확히 입력해주세요.");
            setPwChkMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
            setIsPwChkEffect(false);
        }

    }

    useEffect(() => {
        setPreviewProfileImg(props.img);
    }, [])

    return (
        <div className="member-info">

            <h3>내 정보 수정</h3>

            <div className="update-view">

                <div className="profile-picture">
                    <img src={previewProfileImg ? previewProfileImg : memberDefaultImg} alt="프로필 이미지" className="upload-picture"/>
                    <button onClick={() => setUploadModal(true)} className="update-picture">
                        <FontAwesomeIcon icon={pencil} style={{color: 'white'}}/>
                    </button>
                    {uploadModal ? <UploadModal setUploadModal={setUploadModal} setUploadProfileImg={setUploadProfileImg} setPreviewProfileImg={setPreviewProfileImg} /> : null}
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
                        <div className="update-check">
                            현재 비밀번호
                        </div>
                    </div>
                    <div className="update-value">
                        {
                            `${profileInfo.memberEmail}` != '' ?
                                <div className="update-email">
                                    {profileInfo.memberEmail}
                                </div>
                                :
                                <div className="update-email" style={{visibility: 'hidden'}}>
                                    NONE
                                </div>
                        }
                        <div className="update-nickname">
                            <input type="text" value={memberNickname} onChange={memberNicknameChangeHandler} />
                            {(
                                <span style={ isNicknameEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{nicknameMessage}</span>
                            )}
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
                            {(
                                <span style={ isBirthYEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{birthYMessage}</span>
                            )}
                            {(
                                <span style={ isBirthMEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{birthMMessage}</span>
                            )}
                            {(
                                <span style={ isBirthDEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{birthDMessage}</span>
                            )}
                            <p style={ {fontSize: "13px", marginTop: "7px", color: "#5c636a"} }>
                                태어난 년도 4자리를 정확하게 입력하세요. <br />
                                태어난 월을 선택하세요. <br />
                                태어난 일(날짜) 2자리를 정확하게 입력하세요.
                            </p>
                        </div>

                        <div className="update-check">
                            <input type="password" value={pwDuplicationCheck} onChange={memberPwCheckChangeHandler} />
                            {(
                                <span style={ isPwChkEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{pwChkMessage}</span>
                            )}
                            <p style={ {fontSize: "13px", marginTop: "7px", color: "#5c636a"} }>
                                현재 비밀번호를 정확히 입력해야 수정이 완료됩니다.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="on-update">
                    <button onClick={() => passwordDuplicationChk()}>등록</button>
                    <button onClick={() => navigate(-1)}>취소</button>
                </div>

            </div>
        </div>
    )
}

export default MemberInfoUpdate;