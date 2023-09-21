import React, { useState, useCallback, useEffect, useRef } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import './SignUp.scss';
import AppBarNavigation from "../Navigation/AppBarNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope as emailIcon, faEnvelopeCircleCheck as emailCheckIcon, faLock as passwordIcon, faUnlockKeyhole as passwordCheckIcon,
    faUserPen as nicknameIcon, faCalendarDay as birthIcon, faEye as passwordSeeIcon} from "@fortawesome/free-solid-svg-icons"


const SignUp = () => {
    let navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef(null);
    const passwordCheckRef = useRef(null);
    const nickNameRef = useRef();

    const [memberEmail, setMemberEmail] = useState("");
    const [memberEmailCheck, setMemberEmailCheck] = useState("");
    const [memberEmailCode, setMemberEmailCode] = useState("");
    const [memberPassword, setMemberPassword] = useState("");
    const [memberPasswordCheck, setMemberPasswordCheck] = useState("");
    const [memberNickname, setMemberNickname] = useState("");
    const [memberBirthY, setMemberBirthY] = useState("");
    const [memberBirthM, setMemberBirthM] = useState("");
    const [memberBirthD, setMemberBirthD] = useState("");

    // 오류메시지 저장
    const [memberEmailMessage, setMemberEmailMessage] = useState("");
    const [memberEmailCheckMessage, setMemberEmailCheckMessage] = useState("");
    const [memberPasswordMessage, setMemberPasswordMessage] = useState("");
    const [memberPasswordCheckMessage, setMemberPasswordCheckMessage] = useState("");
    const [memberNicknameMessage, setMemberNicknameMessage] = useState("");
    const [memberBirthMessage, setMemberBirthMessage] = useState("");

    // 유효성 검사
    const [isMemberEmailEffect, setIsMemberEmailEffect] = useState(true);
    const [isMemberEmailHideEffect, setIsMemberEmailHideEffect] = useState(false);
    const [isMemberEmailCheckEffect, setIsMemberEmailCheckEffect] = useState(true);
    const [isMemberPasswordEffect, setIsMemberPasswordEffect] = useState(true);
    const [isMemberPasswordCheckEffect, setIsMemberPasswordCheckEffect] = useState(true);
    const [isMemberNicknameEffect, setIsMemberNicknameEffect] = useState(true);
    const [isMemberBirthEffect, setIsMemberBirthEffect] = useState(true);

    const [isMemberEmailConfirm, setIsMemberEmailConfirm] = useState(false);
    const [isMemberEmailDuplicationConfirm, setIsMemberEmailDuplicationConfirm] = useState(false);
    const [isMemberEmailCheckConfirm, setIsMemberEmailCheckConfirm] = useState(false);

    const signUpEmailHandler = (e)=> {
        const memberEmailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const memberEmailCurrent = e.target.value;
        setMemberEmail(memberEmailCurrent);

        if(memberEmailCurrent.length < 1) {
            setMemberEmailMessage('필수 정보입니다.');
            setIsMemberEmailEffect(false);
            setIsMemberEmailConfirm(false);
        } else {
            if (!memberEmailRegex.test(memberEmailCurrent)) {
                setMemberEmailMessage('이메일 주소를 다시 확인해주세요.');
                setIsMemberEmailEffect(false);
                setIsMemberEmailConfirm(false);
            } else {
                setMemberEmailMessage('');
                setIsMemberEmailEffect(true);
                setIsMemberEmailConfirm(true);
            }
        }
    }

    // 이메일 중복 확인
    const emailDuplicationHandler = async () => {
        const emailDuplicationRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(emailDuplicationRegex.test(memberEmail)) {
            await axios({
                method: "GET",
                url: "/member/signUpDuplicationChk",
                params: {memberEmail: memberEmail}
            }).then((result) => {
                console.log(result.data);
                if(result.data) {
                    setMemberEmailMessage("이미 사용중인 이메일 ID 입니다.");
                    setIsMemberEmailDuplicationConfirm(false);
                    setIsMemberEmailEffect(false);
                } else {
                    setIsMemberEmailDuplicationConfirm(true);
                    setIsMemberEmailEffect(true);
                }
            }).catch(error => {
                console.log("에러내용:", JSON.stringify(error));
            })
        } else {
            setMemberEmailMessage('이메일 주소를 다시 확인해주세요.');
            setIsMemberEmailEffect(false);
            setIsMemberEmailConfirm(false);
            // emailRef.current.focus();
        }
    }

    const emailCheckSendHandler = async () => {

        if(isMemberEmailConfirm == true && isMemberEmailDuplicationConfirm == true) {
            alert('인증코드를 발송했습니다. 이메일을 확인해주세요.');
            setIsMemberEmailEffect(true);
            setIsMemberEmailHideEffect(true);
            setMemberEmailMessage('');

            await axios({
                method: "GET",
                url: "/member/sendAuthCode",
                params: {memberEmail: memberEmail}
            }).then(function(obj) {
                console.log('authCode : ' + obj.data.authCode);
                setMemberEmailCode(obj.data.authCode);
            }).catch(function(error) {
                alert('인증코드 발송에 실패했습니다.');
            })
        } else {
            alert('이메일을 확인해주세요.');
            setMemberEmailMessage('이메일 주소를 다시 확인해주세요.');
            setIsMemberEmailEffect(false);
            setIsMemberEmailConfirm(false);
            // emailRef.current.focus();
        }
    }

    const signUpEmailCheckHandler = (e) => {
        const memberEmailCheckRegex = /^.{6}$/;
        const memberEmailCheckCurrent = e.target.value;

        setMemberEmailCheck(memberEmailCheckCurrent);

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
    }

    const emailCheckConfirmHandler = () => {
        if(memberEmailCheck.length < 1) {
            alert('인증번호를 입력해주세요.');
            setMemberEmailCheckMessage('인증번호를 입력해주세요.');
            setIsMemberEmailCheckEffect(false);
            setIsMemberEmailCheckConfirm(false);
        } else {
            if(memberEmailCheck == memberEmailCode) {
                alert('인증되었습니다.');
                setMemberEmailCheckMessage('인증되었습니다.');
                setIsMemberEmailCheckEffect(true);
                setIsMemberEmailCheckConfirm(true);
            } else {
                alert('인증에 실패했습니다.');
                setMemberEmailCheckMessage('인증에 실패했습니다.');
                setIsMemberEmailCheckEffect(false);
                setIsMemberEmailCheckConfirm(false);
            }
        }
    }

    const signUpPasswordHandler = (e)=> {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!?@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
        const passwordCurrent = e.target.value;
        setMemberPassword(passwordCurrent);

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
    }

    const signUpPasswordCheckHandler = useCallback((e) => {
        const passwordCheckCurrent = e.target.value;
        setMemberPasswordCheck(passwordCheckCurrent);

        if (passwordCheckCurrent.length < 1) {
            setMemberPasswordCheckMessage('필수 정보입니다.');
            setIsMemberPasswordEffect(false);
        } else {
            if (memberPassword === passwordCheckCurrent) {
                setMemberPasswordCheckMessage('');
                setIsMemberPasswordCheckEffect(true);
            } else {
                setMemberPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
                setIsMemberPasswordCheckEffect(false);
            }
        }
    }, [memberPassword])

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

    const signUpNicknameHandler = (e)=> {
        const memberNicknameRegex = /^.{2,20}$/;
        const specialRegex  = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
        const gapRegex  = /\s/g;

        const memberNicknameCurrent = e.target.value;

        setMemberNickname(memberNicknameCurrent);

        if (memberNicknameCurrent.length < 1) {
            setMemberNicknameMessage('필수 정보입니다.');
            setIsMemberNicknameEffect(false);
        } else {
            if (!memberNicknameRegex.test(memberNicknameCurrent)) {
                setMemberNicknameMessage('최소 2자 이상 최대 20자 이하로 작성해주시기 바랍니다.');
                setIsMemberNicknameEffect(false);
            } else {
                if(specialRegex.test(memberNicknameCurrent) || gapRegex.test(memberNicknameCurrent)) {
                    setMemberNicknameMessage('닉네임에 띄어쓰기 혹은 특수문자를 사용하실 수 없습니다.');
                    setIsMemberNicknameEffect(false);
                } else {
                    setMemberNicknameMessage('');
                    setIsMemberNicknameEffect(true);
                }
            }
        }
    }

    // 닉네임 중복 확인
    const nicknameDuplicationHandler = async () => {
        if(isMemberNicknameEffect === true) {

            await axios({
                method: "GET",
                url: "/member/signUpDuplicationChk",
                params: {memberNickname: memberNickname}
            }).then((result) => {
                if(result.data) {
                    setMemberNicknameMessage("이미 사용중인 닉네임입니다.");
                    setIsMemberNicknameEffect(false);
                } else {
                    setIsMemberNicknameEffect(true);
                }
            }).catch(error => {
                console.log("에러내용:", JSON.stringify(error));
            })
        } else {
            setMemberEmailMessage('필수 정보입니다.');
            setIsMemberEmailEffect(false);
            // nickNameRef.current.focus();
        }
    }

    const signUpBirthYearHandler = useCallback((e) => {
        const memberBirthYRegex = /^(19[0-9][0-9]|20\d{2})$/;
        const memberBirthYCurrent = e.target.value;
        setMemberBirthY(memberBirthYCurrent);

        if (!memberBirthYRegex.test(memberBirthYCurrent)) {
            setMemberBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsMemberBirthEffect(false);
        } else if(memberBirthM.length < 1) {
            setMemberBirthMessage('태어난 월을 선택하세요.');
            setIsMemberBirthEffect(false);
        } else {
            setMemberBirthMessage('');
            setIsMemberBirthEffect(true);
        }

    }, [memberBirthM])

    const signUpBirthMonthHandler = useCallback((e) => {
        const memberBirthMRegex = /^(0[0-9]|1[0-2])$/;
        const memberBirthMCurrent = e.target.value;

        setMemberBirthM(memberBirthMCurrent);

        if(memberBirthY.length < 1) {
            setMemberBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsMemberBirthEffect(false);
        } else {
            if (!memberBirthMRegex.test(memberBirthMCurrent)) {
                setMemberBirthMessage('태어난 월을 선택하세요.');
                setIsMemberBirthEffect(false);
            } else {
                setMemberBirthMessage('');
                setIsMemberBirthEffect(true);
            }
        }

    }, [memberBirthY])

    const signUpBirthDayHandler = useCallback((e) => {
        const memberBirthDRegex = /^([1-9]|[1-2][0-9]|3[0-1])$/;
        const memberBirthDCurrent = e.target.value;

        setMemberBirthD(memberBirthDCurrent);

        if(memberBirthY.length < 1) {
            setMemberBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsMemberBirthEffect(false);
        } else if(memberBirthM.length < 1) {
            setMemberBirthMessage('태어난 월을 선택하세요.');
            setIsMemberBirthEffect(false);
        } else {
            if (!memberBirthDRegex.test(memberBirthDCurrent)) {
                setMemberBirthMessage('태어난 일(날짜) 2자리를 정확하게 입력하세요.');
                setIsMemberBirthEffect(false);
            } else {
                setMemberBirthMessage('');
                setIsMemberBirthEffect(true);
            }
        }

    }, [memberBirthY, memberBirthM])

    // const SignUpChangeId = useCallback((e) => {
    //     const memberIdRegex = /^[a-z0-9_-]{5,20}$/;
    //     const memberIdCurrent = e.target.value;
    //     setMemberId(memberIdCurrent);
    //
    //     if (memberIdCurrent < 1) {
    //         setMemberIdMessage('필수 정보입니다.');
    //         setIsPasswordEffect(false);
    //     } else {
    //         if (!memberIdRegex.test(memberIdCurrent)) {
    //             setMemberIdMessage('5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다..');
    //             setIsMemberIdEffect(false);
    //         } else {
    //             setMemberIdMessage('');
    //             setIsMemberIdEffect(true);
    //         }
    //     }
    // }, [])

    // const SignUpChangeGe = useCallback((e) => {
    //     const memberGenderCurrent = e.target.value;
    //     setMemberGender(memberGenderCurrent);
    //
    //     if (memberGenderCurrent.length < 1) {
    //         setMemberGenderMessage('필수 정보입니다.');
    //         setIsMemberGenderEffect(false);
    //     } else {
    //         setMemberGenderMessage('');
    //         setIsMemberGenderEffect(true);
    //     }
    // }, [])

    // const SignUpChangePh = useCallback((e) => {
    //     const memberPhoneRegex = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
    //     const memberPhoneCurrent = e.target.value;
    //     setMemberPhone(memberPhoneCurrent);
    //
    //     if(memberPhoneCurrent.length < 1) {
    //         setMemberPhoneMessage('');
    //     } else {
    //         if (!memberPhoneRegex.test(memberPhoneCurrent)) {
    //             setMemberPhoneMessage('형식에 맞지 않는 번호입니다.');
    //             setIsMemberPhoneEffect(false);
    //         } else {
    //             setMemberPhoneMessage('');
    //             setIsMemberPhoneEffect(true);
    //         }
    //     }
    // }, [])

    const onJoinHandler = async (e) => {

        if(memberBirthD.length == 1) {
            setMemberBirthD("0" + memberBirthD);
        }

        const memberData = {
            memberEmail: `${memberEmail}`,
            memberPw: `${memberPassword}`,
            memberNickname: `${memberNickname}`,
            memberBirth: `${memberBirthY}` + "/" + `${memberBirthM}` + "/" + `${memberBirthD}`,
        }

        if(memberEmail.length < 1) {
            alert('이메일을 입력해주세요.');
            setMemberEmailMessage('필수 정보입니다.');
            setIsMemberEmailEffect(false);
            e.preventDefault();
        } else
        if(memberEmailCheck.length < 1) {
            alert('인증을 진행해주세요.');
            setMemberEmailCheckMessage('인증이 필요합니다.');
            setIsMemberEmailCheckEffect(false);
            e.preventDefault();
        } else
        if(isMemberEmailCheckConfirm == false) {
            alert('인증번호가 틀립니다.');
            setMemberEmailCheckMessage('인증이 필요합니다.');
            setIsMemberEmailCheckEffect(false);
            e.preventDefault();
        } else
        if(memberPassword.length < 1) {
            alert('비밀번호를 입력해주세요.');
            setMemberPasswordMessage('필수 정보입니다.');
            setIsMemberPasswordEffect(false);
            e.preventDefault();
        } else
        if(memberPasswordCheck.length < 1 || memberPassword != memberPasswordCheck) {
            alert('비밀번호를 확인해주세요.');
            setMemberPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
            setIsMemberPasswordCheckEffect(false);
            e.preventDefault();
        } else
        if(memberNickname.length < 1) {
            alert('닉네임을 입력해주세요.');
            setMemberNicknameMessage('필수 정보입니다.');
            setIsMemberNicknameEffect(false);
            e.preventDefault();
        } else
        if(memberBirthY.length < 1) {
            alert('생일 날짜를 입력해주세요.');
            setMemberBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsMemberBirthEffect(false);
            e.preventDefault();
        } else
        if(memberBirthM.length < 1) {
            alert('생일 날짜를 입력해주세요.');
            setMemberBirthMessage('태어난 월을 선택하세요.');
            setIsMemberBirthEffect(false);
            e.preventDefault();
        } else
        if(memberBirthD.length < 1) {
            alert('생일 날짜를 입력해주세요.');
            setMemberBirthMessage('태어난 일(날짜) 2자리를 정확하게 입력하세요.');
            setIsMemberBirthEffect(false);
            e.preventDefault();
        } else {
            console.log(memberData);

            await axios({
                method: "POST",
                url: "/member/signUp",
                data: JSON.stringify(memberData),
                headers: {'Content-type': 'application/json'}
            }).then((res) => {
                window.alert("회원가입이 완료되었습니다");
                navigate("/");
            })
        }
    }

    useEffect(() => {
        // emailRef.current.focus();
    }, []);

    return (
        <div className="signUp-body">
            <AppBarNavigation />

            <div className="signUp-view">

                <div className="common-signUp">
                    <h1>회원가입</h1>

                    <div className="signUp-email">
                        <div className="email-enter">
                            <span className="email-input">
                                <FontAwesomeIcon icon={emailIcon} className="email-icon"/>
                                <input type="text" value={memberEmail} onChange={signUpEmailHandler} onBlur={emailDuplicationHandler}
                                       ref={emailRef} placeholder="이메일 주소" style={ isMemberEmailEffect ? {border: 'none'} : {border: '2px solid red'} } />
                            </span>
                            <span className="email-btn">
                                {
                                    isMemberEmailCheckConfirm ? <button onClick={() => alert('인증이 완료되었습니다.')}>전송</button>
                                        : <button onClick={emailCheckSendHandler}>전송</button>
                                }
                            </span>
                        </div>
                        <div className="email-check" style={ isMemberEmailHideEffect ? {display:'block'} : {display:'none'} }>
                            <span className="email-input">
                                <FontAwesomeIcon icon={emailCheckIcon} className="email-icon"/>
                                <input type="text" value={memberEmailCheck} onChange={signUpEmailCheckHandler}
                                       placeholder="인증번호 확인" style={ isMemberEmailCheckEffect ? {border: 'none'} : {border: '2px solid red'} } />
                            </span>
                            <span className="email-btn">
                                {
                                    isMemberEmailCheckConfirm ? <button onClick={() => alert('인증이 완료되었습니다.')}>인증</button>
                                        : <button onClick={emailCheckConfirmHandler}>인증</button>
                                }
                            </span>
                        </div>

                        {(
                            <div style={  isMemberEmailEffect ? null
                                : {color:'red', fontSize:'13px', marginTop:'15px', fontWeight:'bold'} }>{memberEmailMessage}</div>
                        )}

                        {(
                            <div style={ isMemberEmailCheckEffect ? {color:'green', fontSize:'13px', marginTop:'15px', fontWeight:'bold'}
                                : {color:'red', fontSize:'13px', marginTop:'15px', fontWeight:'bold'} }>{memberEmailCheckMessage}</div>
                        )}
                    </div>
                    <div className="signUp-password">
                        <div className="password-input">
                            <FontAwesomeIcon icon={passwordIcon} className="password-icon"/>
                            <FontAwesomeIcon icon={passwordSeeIcon} onClick={() => passwordSeeHandler()} className="passwordSee-icon"/>
                            <input type="password" value={ memberPassword} onChange={signUpPasswordHandler} ref={passwordRef}
                                   placeholder="비밀번호" style={ isMemberPasswordEffect ? {border: 'none'} : {border: '2px solid red'} } />

                            {(
                                <div style={ isMemberPasswordEffect ? null
                                    : {color:'red', fontSize:'13px', marginTop:'10px', fontWeight:'bold'} }>{memberPasswordMessage}</div>
                            )}
                        </div>

                        <div className="signUp-password-check">
                            <div className="password-check-input">
                                <FontAwesomeIcon icon={passwordCheckIcon} className="password-icon"/>
                                <FontAwesomeIcon icon={passwordSeeIcon} onClick={() => passwordCheckSeeHandler()} className="passwordSee-icon"/>
                                <input type="password" placeholder="비밀번호 확인" value={memberPasswordCheck} ref={passwordCheckRef}
                                       onChange={signUpPasswordCheckHandler} style={ isMemberPasswordCheckEffect ? {border: 'none'} : {border: '2px solid red'} } />

                                {(
                                    <div style={ isMemberPasswordCheckEffect ? null
                                        : {color:'red', fontSize:'13px', marginTop:'10px', fontWeight:'bold'} }>{memberPasswordCheckMessage}</div>
                                )}
                            </div>
                        </div>

                    </div>
                    <div className="signUp-etc">
                        <div className="signUp-nickname">
                            <div className="nickname-input">
                                <FontAwesomeIcon icon={nicknameIcon} className="nickname-icon"/>
                                <input type="text" value={memberNickname} onChange={signUpNicknameHandler} onBlur={nicknameDuplicationHandler}
                                       ref={nickNameRef} placeholder="닉네임" style={ isMemberNicknameEffect ? {border: 'none'} : {border: '2px solid red'} } />

                                {(
                                    <div style={ isMemberNicknameEffect ? null
                                        : {color:'red', fontSize:'13px', marginTop:'10px', fontWeight:'bold'} }>{memberNicknameMessage}</div>
                                )}
                            </div>
                        </div>
                        <div className="signUp-birth">
                            <div className="birth-input">
                                <span className="birth-year">
                                    <FontAwesomeIcon icon={birthIcon} className="birth-icon"/>
                                    <input type="text" id="userBirthY" value={memberBirthY} onChange={signUpBirthYearHandler} placeholder="년(4자)"
                                           style={ isMemberBirthEffect ? {border: 'none'}
                                               : {borderTop: '2px solid red', borderBottom: '2px solid red', borderLeft: '2px solid red'} } />
                                </span>
                                <span className="birth-month">
                                    <select id="userBirthM" value={memberBirthM} onChange={signUpBirthMonthHandler}
                                            style={ isMemberBirthEffect ? null : {borderTop: '2px solid red', borderBottom: '2px solid red'} } >
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
                                </span>
                                <span className="birth-day">
                                    <input type="text" id="userBirthD" value={memberBirthD} onChange={signUpBirthDayHandler} placeholder="일"
                                           style={ isMemberBirthEffect ? {border: 'none'}
                                               : {borderTop: '2px solid red', borderBottom: '2px solid red', borderRight: '2px solid red'} } />
                                </span>

                                {(
                                    <div style={ isMemberBirthEffect ? null
                                        : {color:'red', fontSize:'13px', marginTop:'10px', fontWeight:'bold'} }>{memberBirthMessage}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="on-submit">
                    <div className="on-signUp">
                        <button onClick={onJoinHandler}>
                            가입하기
                        </button>
                    </div>
                    <div className="on-cancel">
                        <Link to="/">
                            <button>
                                취소
                            </button>
                        </Link>
                    </div>
                </div>

            </div>

            <FooterNavigation />
        </div>
    )
}
export default SignUp;