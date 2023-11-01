import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";
import {useNavigate} from "react-router-dom";

const MemberInfoPwUpdate = (props) => {

    const navigate = useNavigate();
    const memberInfo = props.info;;

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!?@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

    const [memberPresentPwChk, setMemberPresentPwChk] = useState("");
    const [memberChangePw, setMemberChangePw] = useState("");
    const [memberChangePwChk, setMemberChangePwChk] = useState("");

    const [isPresentPwChkEffect, setIsPresentPwChkEffect] = useState(true);
    const [isChangePwEffect, setIsChangePwEffect] = useState(true);
    const [isChangePwChkEffect, setIsChangePwChkEffect] = useState(true);

    const [presentPwChkMessage, setPresentPwChkMessage] = useState("");
    const [changePwMessage, setChangePwMessage] = useState("");
    const [changePwChkMessage, setChangePwChkMessage] = useState("");

    const passwordDuplicationChk = async() => {
        await axios({
            method: "GET",
            url: "member/passwordDuplicationChk",
            params: {passwordCheck: memberPresentPwChk}
        }).then((res) => {
            if(res.data) {
                setPresentPwChkMessage('');
                setIsPresentPwChkEffect(true);
                // eslint-disable-next-line eqeqeq
                if(memberPresentPwChk == memberChangePw) {
                    alert("이전 비밀번호와 같습니다.");
                    setChangePwMessage('이전 비밀번호와 같습니다.');
                    setIsChangePwEffect(false);
                } else {
                    changeMemberPassword();
                }
            } else {
                alert("현재 비밀번호와 다릅니다.");
                setPresentPwChkMessage('현재 비밀번호와 다릅니다.');
                setIsPresentPwChkEffect(false);
            }
        })
    }

    const memberPresentPwCheckHandler = (e) => {
        const presentPwChk = e.target.value

        if (!passwordRegex.test(presentPwChk)) {
            setPresentPwChkMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
            setIsPresentPwChkEffect(false);
        } else {
            setPresentPwChkMessage('');
            setIsPresentPwChkEffect(true);
        }

        setMemberPresentPwChk(presentPwChk);
    }

    const memberChangePwHandler = (e) => {
        const changePw = e.target.value

        if (!passwordRegex.test(changePw)) {
            setChangePwMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
            setIsChangePwEffect(false);
        } else {
            setChangePwMessage('');
            setIsChangePwEffect(true);
        }

        setMemberChangePw(changePw);
    }

    const memberChangePwCheckHandler = (e) => {
        const changePwChk = e.target.value

        if (!passwordRegex.test(changePwChk)) {
            setChangePwChkMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
            setIsChangePwChkEffect(false);
        } else {
            // eslint-disable-next-line eqeqeq
            if(memberChangePw != changePwChk) {
                setChangePwChkMessage('비밀번호가 다릅니다.');
                setIsChangePwChkEffect(false);
            } else {
                setChangePwChkMessage('');
                setIsChangePwChkEffect(true);
            }
        }

        setMemberChangePwChk(changePwChk);
    }

    const changeMemberPassword = async() => {

        if(memberPresentPwChk < 1) {
            if(memberPresentPwChk < 1) {
                alert("현재 비밀번호를 입력해주세요.");
                setPresentPwChkMessage('현재 비밀번호를 입력해주세요.');
                setIsPresentPwChkEffect(false);
            }
        }

        if(isPresentPwChkEffect && isChangePwEffect && isChangePwChkEffect) {
            await axios({
                method: "PUT",
                url: "member/passwordUpdate",
                params: {changePassword: memberChangePw}
            }).then((res) => {
                const result = res.data.result;

                if(result) {
                    window.alert("변경이 완료되었습니다.");
                    navigate(-1);
                } else {
                    window.alert("비밀번호 변경에 실패하였습니다.");
                }
            })
        } else {
            if(!isPresentPwChkEffect) {
                alert("현재 비밀번호를 입력해주세요.");
                setPresentPwChkMessage('현재 비밀번호를 입력해주세요.');
                setIsPresentPwChkEffect(false);
            }
            if(!isChangePwEffect) {
                alert("변경할 비밀번호를 입력해주세요.");
                setChangePwMessage('변경할 비밀번호를 입력해주세요.');
                setIsChangePwEffect(false);
            }
            if(!isChangePwChkEffect) {
                alert("비밀번호가 동일하지 않습니다.");
                setChangePwChkMessage('비밀번호가 동일하지 않습니다.');
                setIsChangePwChkEffect(false);
            }
        }

    }

    useEffect(() => {

    }, [])

    return (
        <div>

            <h3>비밀번호 변경</h3>

            <div className="update-pw-view">
                <p style={{ fontSize: '16px', textAlign: 'left', marginTop: '40px', marginLeft: '100px'}}>
                    - 비밀번호는 8~16자이내로 영문 대 소문자, 숫자, 특수문자를 조합하여 등록하셔야 합니다. <br/>
                      &nbsp;&nbsp; 변경된 비밀번호는 바로 반영되어 사용하실 수 있습니다.
                </p>

                <div className="update-password">

                    <div className="update-pw-key">
                        <div className="update-pw-email">
                            이메일
                        </div>
                        <div className="update-pw-present">
                            현재 비밀번호
                        </div>
                        <div className="update-pw-new">
                            신규 비밀번호
                        </div>
                        <div className="update-pw-check">
                            비밀번호 확인
                        </div>
                    </div>
                    <div className="update-pw-value">
                        {
                            // eslint-disable-next-line eqeqeq
                            `${memberInfo.memberEmail}` != '' ?
                                <div className="update-pw-email font-custom">
                                    {memberInfo.memberEmail}
                                </div>
                                :
                                <div className="update-pw-email font-custom" style={{visibility: 'hidden'}}>
                                    NONE
                                </div>
                        }
                        <div className="update-pw-present font-custom">
                            <input type="password" value={memberPresentPwChk} onChange={memberPresentPwCheckHandler} />
                            {(
                                <span style={ isPresentPwChkEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{presentPwChkMessage}</span>
                            )}
                        </div>
                        <div className="update-pw-new font-custom">
                            <input type="password" value={memberChangePw} onChange={memberChangePwHandler} />
                            {(
                                <span style={ isChangePwEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{changePwMessage}</span>
                            )}
                        </div>
                        <div className="update-pw-check font-custom">
                            <input type="password" value={memberChangePwChk} onChange={memberChangePwCheckHandler} />
                            {(
                                <span style={ isChangePwChkEffect ? null : {color:'red', fontSize:'12px', marginLeft: '7px', fontWeight: 'bold'} }>{changePwChkMessage}</span>
                            )}
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

export default MemberInfoPwUpdate;