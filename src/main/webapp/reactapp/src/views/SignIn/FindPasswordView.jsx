import React, {useCallback, useEffect, useRef, useState} from "react";
import "./SignIn.scss";
import '../Layouts/MainView.scss'
import AppBarNavigation from "../Navigation/AppBarNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    fa1 as progressIcon1,
    fa2 as progressIcon2,
    fa3 as progressIcon3,
    faCheck as progressCheckIcon,
    faEye as passwordSeeIcon,
    faReply as backIcon
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const FindPasswordView = () => {

    const navigate = useNavigate();
    const passwordRef = useRef(null);
    const passwordCheckRef = useRef(null);

    const [emailAuthCode, setEmailAuthode] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberEmailCheck, setMemberEmailCheck] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [memberPasswordCheck, setMemberPasswordCheck] = useState("");

    const [memberEmailMessage, setMemberEmailMessage] = useState("");
    const [memberEmailCheckMessage, setMemberEmailCheckMessage] = useState("");
    const [memberPasswordMessage, setMemberPasswordMessage] = useState("");
    const [memberPasswordCheckMessage, setMemberPasswordCheckMessage] = useState("");

    const [isMemberEmailEffect, setIsMemberEmailEffect] = useState(true);
    const [isMemberEmailCheckEffect, setIsMemberEmailCheckEffect] = useState(true);
    const [isMemberPasswordEffect, setIsMemberPasswordEffect] = useState(true);
    const [isMemberPasswordCheckEffect, setIsMemberPasswordCheckEffect] = useState(true);

    const [isMemberEmailShowEffect, setIsMemberEmailShowEffect] = useState(true);
    const [isMemberEmailCheckShowEffect, setIsMemberEmailCheckShowEffect] = useState(false);
    const [isMemberPasswordShowEffect, setIsMemberPasswordShowEffect] = useState(false);

    const [isEmailIconShow, setIsEmailIconShow] = useState(false);
    const [isEmailCheckIconShow, setIsEmailCheckIconShow] = useState(false);
    const [isPasswordIconShow, setIsPasswordIconShow] = useState(false);

    const [isMemberEmailConfirm, setIsMemberEmailConfirm] = useState(false);
    const [isMemberEmailCheckConfirm, setIsMemberEmailCheckConfirm] = useState(false);


    const findPwEmailHandler = (e)=> {
        const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const emailCurrent = e.target.value;

        if(emailCurrent.length < 1) {
            setMemberEmailMessage('필수 정보입니다.');
            setIsMemberEmailEffect(false);
            setIsMemberEmailConfirm(false);
        } else {
            if (!emailRegex.test(emailCurrent)) {
                setMemberEmailMessage('이메일 주소를 다시 확인해주세요.');
                setIsMemberEmailEffect(false);
                setIsMemberEmailConfirm(false);
            } else {
                setMemberEmailMessage('');
                setIsMemberEmailEffect(true);
                setIsMemberEmailConfirm(true);
            }
        }

        setMemberEmail(emailCurrent);
    }

    const findPwEmailCheckSendHandler = async () => {

        if(isMemberEmailConfirm == true) {
            alert('인증코드를 발송했습니다. 이메일을 확인해주세요.');
            setIsMemberEmailEffect(true);
            setMemberEmailMessage('');

            setIsMemberEmailShowEffect(false);
            setIsMemberEmailCheckShowEffect(true);

            setIsEmailIconShow(true);

            await axios({
                method: "GET",
                url: "/member/sendAuthCode",
                params: {memberEmail: memberEmail}
            }).then(function(obj) {
                console.log('authCode : ' + obj.data.authCode);
                setEmailAuthode(obj.data.authCode);
            }).catch(function(error) {
                alert('인증코드 발송에 실패했습니다.');
            })
        } else {
            alert('이메일을 확인해주세요.');
            setMemberEmailMessage('이메일 주소를 다시 확인해주세요.');
            setIsMemberEmailEffect(false);
            setIsMemberEmailConfirm(false);


            setIsMemberEmailShowEffect(true);
            setIsMemberEmailCheckShowEffect(false);
            // emailRef.current.focus();
        }
    }

    const findPwEmailCheckHandler = (e) => {
        const memberEmailCheckRegex = /^.{6}$/;
        const memberEmailCheckCurrent = e.target.value;

        if(memberEmailCheckCurrent.length < 1) {
            setMemberEmailCheckMessage('필수 정보입니다.');
            setIsMemberEmailCheckEffect(false);
        } else {
            if (!memberEmailCheckRegex.test(memberEmailCheckCurrent)) {
                setMemberEmailCheckMessage('인증번호는 6자리입니다.');
                setIsMemberEmailCheckEffect(false);
            } else {
                setMemberEmailCheckMessage('');
                setIsMemberEmailCheckEffect(true);
            }
        }

        setMemberEmailCheck(memberEmailCheckCurrent);
    }

    const findPwEmailCheckConfirmHandler = () => {
        if(memberEmailCheck.length < 1) {
            alert('인증번호를 입력해주세요.');
            setMemberEmailCheckMessage('인증번호를 입력해주세요.');
            setIsMemberEmailCheckEffect(false);
            setIsMemberEmailCheckConfirm(false);
            setIsMemberEmailCheckShowEffect(true);
            setIsMemberPasswordShowEffect(false);
        } else {
            if(memberEmailCheck == emailAuthCode) {
                alert('인증되었습니다.');
                setMemberEmailCheckMessage('인증되었습니다.');
                setIsMemberEmailCheckEffect(true);
                setIsMemberEmailCheckConfirm(true);
                setIsMemberEmailCheckShowEffect(false);
                setIsMemberPasswordShowEffect(true);
                setIsEmailCheckIconShow(true);
            } else {
                alert('인증에 실패했습니다.');
                setMemberEmailCheckMessage('인증에 실패했습니다.');
                setIsMemberEmailCheckEffect(false);
                setIsMemberEmailCheckConfirm(false);
                setIsMemberEmailCheckShowEffect(true);
                setIsMemberPasswordShowEffect(false);
            }
        }
    }

    const findPwPasswordHandler = (e)=> {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!?@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
        const passwordCurrent = e.target.value;

        if (passwordCurrent.length < 1) {
            setMemberPasswordMessage('필수 정보입니다.');
            setIsMemberPasswordEffect(false);
        } else {
            if (!passwordRegex.test(passwordCurrent)) {
                setMemberPasswordMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
                setIsMemberPasswordEffect(false);
            } else {
                setMemberPasswordMessage('');
                setIsMemberPasswordEffect(true);
            }
        }

        setMemberPassword(passwordCurrent);
    }

    const findPwPasswordCheckHandler = (e)=> {
        const passwordCheckCurrent = e.target.value;

        if (passwordCheckCurrent.length < 1) {
            setMemberPasswordCheckMessage('필수 정보입니다.');
            setIsMemberPasswordCheckEffect(false);
        } else {
            if (memberPassword != passwordCheckCurrent) {
                setMemberPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
                setIsMemberPasswordCheckEffect(false);
            } else {
                setMemberPasswordCheckMessage('');
                setIsMemberPasswordCheckEffect(true);
            }
        }

        setMemberPasswordCheck(passwordCheckCurrent);
    }

    const customAlert = () => {
        if (window.confirm("회원가입을 진행하시겠습니까?") == true){
            navigate("/signUp");
        } else {
            navigate(-1);
        }
    }

    const findPwPasswordChangeHandler = async() => {

        if(isMemberPasswordEffect && isMemberPasswordCheckEffect) {
            await axios({
                method: "PUT",
                url: "member/passwordUpdate",
                params: {memberEmail: memberEmail, changePassword: memberPassword}
            }).then((res) => {
                alert("비밀번호 재설정에 성공하였습니다. \n" +
                    "인증에 사용한 이메일과 변경한 비밀번호로 로그인하시길 바랍니다.");
                navigate(-1);
            }).catch((res) => {
                alert("가입되어 있지 않은 이메일입니다. \n" +
                    "회원가입을 진행해주시길 바랍니다.");
                customAlert();
            })
        } else {
            if(!isMemberPasswordEffect) {
                alert("비밀번호 형식에 맞게 입력해주세요.");
                setMemberPasswordMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
                setIsMemberPasswordEffect(false);
            }
            if(!isMemberPasswordCheckEffect) {
                alert("비밀번호가 동일하지 않습니다.");
                setMemberPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
                setIsMemberPasswordCheckEffect(false);
            }
        }

    }

    const passwordSeeHandler = () => {
        const typeCheck = passwordRef.current.type;

        if(typeCheck == 'password') {
            passwordRef.current.type = 'text';
        } else {
            passwordRef.current.type = 'password';
        }
    }

    const passwordCheckSeeHandler = () => {
        const typeCheck = passwordCheckRef.current.type;

        if(typeCheck == 'password') {
            passwordCheckRef.current.type = 'text';
        } else {
            passwordCheckRef.current.type = 'password';
        }
    }

    const enterOnKeyHandler = (e) => {
        if(e.key === 'Enter' && isMemberEmailShowEffect == true) {
            findPwEmailCheckSendHandler();
        } else if(e.key === 'Enter' && isMemberEmailCheckShowEffect == true) {
            findPwEmailCheckConfirmHandler();
        } else if(e.key === 'Enter' && isMemberPasswordShowEffect == true) {
            findPwPasswordChangeHandler();
        }
    }


    useEffect( () => {

    }, [])

    return (
        <div className="signIn-body">
            <AppBarNavigation />

                <div className="findPassword-view">

                    <div className="findPassword-progress">
                        <span style={{marginRight: "100px"}}>
                            {
                                isEmailIconShow ? <FontAwesomeIcon icon={progressCheckIcon} className="progress-icon" style={{backgroundColor: '#0d6efd'}}/>
                                    : <FontAwesomeIcon icon={progressIcon1} className="progress-icon"/>
                            }

                            이메일 입력
                        </span>
                        <span className="line-draw1"></span>
                        <span style={{marginRight: "100px"}}>
                            {
                                isEmailCheckIconShow ? <FontAwesomeIcon icon={progressCheckIcon} className="progress-icon" style={{backgroundColor: '#0d6efd'}}/>
                                    : <FontAwesomeIcon icon={progressIcon2} className="progress-icon"/>
                            }

                            이메일 인증
                        </span>
                        <span className="line-draw2"></span>
                        <span>
                            {
                                isPasswordIconShow ? <FontAwesomeIcon icon={progressCheckIcon} className="progress-icon" style={{backgroundColor: 'deepskyblue'}}/>
                                    : <FontAwesomeIcon icon={progressIcon3} className="progress-icon"/>
                            }

                            비밀번호 재설정
                        </span>
                    </div>

                    <div className="email-input">
                        <FontAwesomeIcon icon={backIcon} className="back-icon" onClick={() => navigate(-1)} title="로그인화면으로 돌아가기"/>
                        <div className="email-send" style={ isMemberEmailShowEffect ? {display: 'block'} : {display: 'none'}}>
                            <p style={{ fontSize: '12px', marginBottom: '55px'}}>
                                ※ 본인확인을 위해 가입 시 입력한 이메일을 통해 인증을 진행합니다.
                            </p>

                            <div>
                                <input type="text" value={memberEmail} onChange={findPwEmailHandler} onKeyDown={enterOnKeyHandler} placeholder="이메일 주소"
                                       style={ isMemberEmailEffect ? {border: '2px solid #adb5bd'} : {border: '2px solid red'} } />
                            </div>
                            <div>
                                {
                                    isMemberEmailCheckConfirm ? <button onClick={() => alert('인증이 완료되었습니다.')}>전송</button>
                                        : <button onClick={findPwEmailCheckSendHandler}>전송</button>
                                }
                            </div>

                            {(
                                <div style={ isMemberEmailEffect ? null
                                    : {color:'red', fontSize:'13px', marginTop:'15px', fontWeight:'bold'} }>{memberEmailMessage}</div>
                            )}
                        </div>

                        <div className="email-check" style={ isMemberEmailCheckShowEffect ? {display: 'block'} : {display: 'none'}}>
                            <p style={{ fontSize: '12px', marginBottom: '55px'}}>
                                ※ 입력한 이메일로 전송된 인증코드를 입력바랍니다.
                            </p>
                            <span>
                                <input type="text" value={memberEmailCheck} onChange={findPwEmailCheckHandler} onKeyDown={enterOnKeyHandler} placeholder="인증번호 확인"
                                       style={ isMemberEmailCheckEffect ? {border: '2px solid #adb5bd'} : {border: '2px solid red'} } />
                            </span>
                            <span>
                                {
                                    isMemberEmailCheckConfirm ? <button onClick={() => alert('인증이 완료되었습니다.')}>인증</button>
                                        : <button onClick={findPwEmailCheckConfirmHandler}>인증</button>
                                }
                            </span>

                            {(
                                <div style={ isMemberEmailCheckEffect ? {color:'green', fontSize:'13px', marginTop:'15px', fontWeight:'bold'}
                                    : {color:'red', fontSize:'13px', marginTop:'15px', fontWeight:'bold'} }>{memberEmailCheckMessage}</div>
                            )}
                        </div>

                        <div className="password-input" style={ isMemberPasswordShowEffect ? {display: 'block'} : {display: 'none'}}>
                            <p style={{ fontSize: '12px', marginBottom: '35px'}}>
                                ※ 새로 사용할 비밀번호를 입력해주세요.
                            </p>
                            <div className="password-enter">
                                <FontAwesomeIcon icon={passwordSeeIcon} onClick={() => passwordSeeHandler()} className="passwordSee-icon1"/>
                                <input type="password" value={ memberPassword} onChange={findPwPasswordHandler} ref={passwordRef}
                                       placeholder="비밀번호" style={ isMemberPasswordEffect ? {border: 'none'} : {border: '2px solid red'} } />

                                {(
                                    <div style={ isMemberPasswordEffect ? null
                                        : {color:'red', fontSize:'13px', marginTop:'10px', fontWeight:'bold'} }>{memberPasswordMessage}</div>
                                )}
                            </div>
                            <div className="password-check">
                                <FontAwesomeIcon icon={passwordSeeIcon} onClick={() => passwordCheckSeeHandler()} className="passwordSee-icon2"/>
                                <input type="password" placeholder="비밀번호 확인" value={memberPasswordCheck} onKeyDown={enterOnKeyHandler} ref={passwordCheckRef}
                                       onChange={findPwPasswordCheckHandler} style={ isMemberPasswordCheckEffect ? {border: 'none'} : {border: '2px solid red'} } />

                                {(
                                    <div style={ isMemberPasswordCheckEffect ? null
                                        : {color:'red', fontSize:'13px', marginTop:'10px', fontWeight:'bold'} }>{memberPasswordCheckMessage}</div>
                                )}
                            </div>
                            <div className="password-confirm">
                                <button onClick={findPwPasswordChangeHandler}>
                                    비밀번호 재설정 완료
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

            <FooterNavigation />
        </div>
    )
}

export default FindPasswordView;