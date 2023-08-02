import React, { useState, useCallback, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Row} from "react-bootstrap";
import './SignUp.css';

const SignUp = () => {
    const navigate = useNavigate();
    const emailRef = useRef();
    const nickNameRef = useRef();

    const text1 = "필수 정보입니다.";

    useEffect(() => {
        emailRef.current.focus();
    }, []);

    const [userId, setUserId] = useState("");
    const [userPw, setUserPw] = useState("");
    const [userPwChk, setUserPwChk] = useState("");
    const [userName, setUserName] = useState("");
    const [userNickName, setUserNickName] = useState("");
    const [userBirthY, setUserBirthY] = useState("");
    const [userBirthM, setUserBirthM] = useState("");
    const [userBirthD, setUserBirthD] = useState("");
    const [userGender, setUserGender] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userEmailChk, setUserEmailChk] = useState("");
    const [userEmailCode, setUserEmailCode] = useState("");
    const [userPhone, setUserPhone] = useState("");

    //오류메시지 상태저장
    const [userIdMessage, setUserIdMessage] = useState("");
    const [userPwMessage, setUserPwMessage] = useState("");
    const [userPwChkMessage, setUserPwChkMessage] = useState("");
    const [userNameMessage, setUserNameMessage] = useState("");
    const [userBirthMessage, setUserBirthMessage] = useState("");
    const [userGenderMessage, setUserGenderMessage] = useState("");
    const [userEmailMessage, setUserEmailMessage] = useState("");
    const [userEmailChkMessage, setUserEmailChkMessage] = useState("");
    const [userPhoneMessage, setUserPhoneMessage] = useState("");

    // 유효성 검사
    const [isUserIdEffect, setIsUserIdEffect] = useState(false);
    const [isPasswordEffect, setIsPasswordEffect] = useState(false);
    const [isPasswordConfirmEffect, setIsPasswordConfirmEffect] = useState(false);
    const [isUserNameEffect, setIsUserNameEffect] = useState(false);
    const [isUserBirthEffect, setIsUserBirthEffect] = useState(false);
    const [isUserGenderEffect, setIsUserGenderEffect] = useState(false);
    const [isUserEmailEffect, setIsUserEmailEffect] = useState(false);
    const [isUserEmailHideEffect, setIsUserEmailHideEffect] = useState(false);
    const [isUserEmailChkEffect, setIsUserEmailChkEffect] = useState(false);
    const [isUserEmailDuplicationEffect, setIsUserEmailDuplicationEffect] = useState(false);
    const [isUserPhoneEffect, setIsUserPhoneEffect] = useState(false);

    const SignUpChangeId = useCallback((e) => {
        const userIdRegex = /^[a-z0-9_-]{5,20}$/;
        const userIdCurrent = e.target.value;
        setUserId(userIdCurrent);

        if (userIdCurrent < 1) {
            setUserIdMessage(text1);
            setIsPasswordEffect(false);
        } else {
            if (!userIdRegex.test(userIdCurrent)) {
                setUserIdMessage('5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다..');
                setIsUserIdEffect(false);
            } else {
                setUserIdMessage('');
                setIsUserIdEffect(true);
            }
        }
    }, [])

    const SignUpChangePw = useCallback((e) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
        const passwordCurrent = e.target.value;
        setUserPw(passwordCurrent);

        if (passwordCurrent.length < 1) {
            setUserPwMessage(text1);
            setIsPasswordEffect(false);
        } else {
            if (!passwordRegex.test(passwordCurrent)) {
                setUserPwMessage('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
                setIsPasswordEffect(false);
            } else {
                setUserPwMessage('');
                setIsPasswordEffect(true);
            }
        }
    }, [])

    const SignUpChangePc = useCallback((e) => {
        const passwordConfirmCurrent = e.target.value;
        setUserPwChk(passwordConfirmCurrent);

        console.log(passwordConfirmCurrent);
        console.log(userPw);

        if (passwordConfirmCurrent.length < 1) {
            setUserPwChkMessage('필수 정보입니다.');
            setIsPasswordEffect(false);
        } else {
            if (userPw === passwordConfirmCurrent) {
                setUserPwChkMessage('');
                setIsPasswordConfirmEffect(true);
            } else {
                setUserPwChkMessage('비밀번호가 일치하지 않습니다.');
                setIsPasswordConfirmEffect(false);
            }
        }
    }, [userPw])

    useEffect(() => {
        if(userPwChk.length > 1) {
            if (userPw === userPwChk) {
                setUserPwChkMessage('');
                setIsPasswordConfirmEffect(true);
            } else {
                setUserPwChkMessage('비밀번호가 일치하지 않습니다.');
                setIsPasswordConfirmEffect(false);
            }
        }
    }, [userPw, userPwChk])

    const SignUpChangeNm = useCallback((e) => {
        const userNameRegex = /^.{3,20}$/;
        const specialRegex  = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
        const gapRegex  = /\s/g;

        const userNameCurrent = e.target.value;
        // setUserName(userNameCurrent);
        setUserNickName(userNameCurrent);

        if (userNameCurrent.length < 1) {
            setUserNameMessage('필수 정보입니다.');
            setIsUserNameEffect(false);
        } else {
            if (!userNameRegex.test(userNameCurrent)) {
                // setUserNameMessage('한글과 영문 대 소문자를 사용하세요. (특수기호, 공백 사용 불가)');
                setUserNameMessage('최소 3자 이상 최대 20자 이하로 작성해주시기 바랍니다.');
                setIsUserNameEffect(false);
            } else {
                if(specialRegex.test(userNameCurrent) || gapRegex.test(userNameCurrent)) {
                    setUserNameMessage('닉네임에 띄어쓰기 혹은 특수문자를 사용하실 수 없습니다.');
                    setIsUserNameEffect(false);
                } else {
                    setUserNameMessage('');
                    setIsUserNameEffect(true);
                }
            }
        }
    }, [])

    const SignUpChangeBrY = useCallback((e) => {
        const userBirthYRegex = /^(19[0-9][0-9]|20\d{2})$/;
        const userBirthYCurrent = e.target.value;
        setUserBirthY(userBirthYCurrent);

        if (!userBirthYRegex.test(userBirthYCurrent)) {
            setUserBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsUserBirthEffect(false);
        } else if(userBirthM.length < 1) {
            setUserBirthMessage('태어난 월을 선택하세요.');
            setIsUserBirthEffect(false);
        } else {
            setUserBirthMessage('');
            setIsUserBirthEffect(true);
        }

    }, [userBirthM])

    const SignUpChangeBrM = useCallback((e) => {
        const userBirthMRegex = /^(0[0-9]|1[0-2])$/;
        const userBirthMCurrent = e.target.value;

        setUserBirthM(userBirthMCurrent);

        if(userBirthY.length < 1) {
            setUserBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsUserBirthEffect(false);
        } else {
            if (!userBirthMRegex.test(userBirthMCurrent)) {
                setUserBirthMessage('태어난 월을 선택하세요.');
                setIsUserBirthEffect(false);
            } else {
                setUserBirthMessage('');
                setIsUserBirthEffect(true);
            }
        }

    }, [userBirthY])

    const SignUpChangeBrD = useCallback((e) => {
        const userBirthDRegex = /^([1-9]|[1-2][0-9]|3[0-1])$/;
        const userBirthDCurrent = e.target.value;

        if(userBirthDCurrent.length < 2) {
            setUserBirthD('0' + userBirthDCurrent);
        } else {
            setUserBirthD(userBirthDCurrent);
        }

        if(userBirthY.length < 1) {
            setUserBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsUserBirthEffect(false);
        } else if(userBirthM.length < 1) {
            setUserBirthMessage('태어난 월을 선택하세요.');
            setIsUserBirthEffect(false);
        } else {
            if (!userBirthDRegex.test(userBirthDCurrent)) {
                setUserBirthMessage('태어난 일(날짜) 2자리를 정확하게 입력하세요.');
                setIsUserBirthEffect(false);
            } else {
                setUserBirthMessage('');
                setIsUserBirthEffect(true);
            }
        }

    }, [userBirthY, userBirthM])

    const SignUpChangeGe = useCallback((e) => {
        const userGenderCurrent = e.target.value;
        setUserGender(userGenderCurrent);

        if (userGenderCurrent.length < 1) {
            setUserGenderMessage('필수 정보입니다.');
            setIsUserGenderEffect(false);
        } else {
            setUserGenderMessage('');
            setIsUserGenderEffect(true);
        }
    }, [])

    // 윤년 등 해당 월에 대한 날짜 로직 추가 (예정)

    const SignUpChangeEm = useCallback((e) => {
        const userEmailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const userEmailCurrent = e.target.value;
        setUserEmail(userEmailCurrent);

        if(userEmailCurrent.length < 1) {
            setUserEmailMessage('필수 정보입니다.');
            setIsUserEmailEffect(false);
        } else {
            if (!userEmailRegex.test(userEmailCurrent)) {
                setUserEmailMessage('이메일 주소를 다시 확인해주세요.');
                setIsUserEmailEffect(false);
            } else {
                setUserEmailMessage('');
                setIsUserEmailEffect(true);
            }
        }
    }, [])

    // 이메일 중복 확인
    const EmailDuplicationChk = () => {
        const emailDuplicationRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(emailDuplicationRegex.test(userEmail)) {
            console.log(userEmail);
            axios({
                method: "GET",
                url: "/users/signUpDuplicationChk",
                params: {userEmail: userEmail}
            }).then((result) => {
                    console.log(result.data);
                    if(result.data) {
                        setUserEmailMessage("이미 사용중인 이메일 ID 입니다.");
                        setIsUserEmailDuplicationEffect(false);
                        setIsUserEmailEffect(false);
                    } else {
                        setIsUserEmailDuplicationEffect(true);
                        setIsUserEmailEffect(true);
                    }
                }).catch(error => {
                console.log("에러내용:", JSON.stringify(error));
            })
        } else {
            setUserEmailMessage('필수 정보입니다.');
            setIsUserEmailEffect(false);
            emailRef.current.focus();
        }
    }

    // 닉네임 중복 확인
    const nickNameDuplicationChk = () => {
        const nickNameDuplicationRegex = /^[a-zA-Z가-힣]{3,20}$/;
        if(isUserNameEffect === true) {
            console.log(userNickName);
            axios({
                method: "GET",
                url: "/users/signUpDuplicationChk",
                params: {userNickName: userNickName}
            }).then((result) => {
                console.log(result.data);
                if(result.data) {
                    setUserNameMessage("이미 사용중인 닉네임입니다.");
                    setIsUserNameEffect(false);
                } else {
                    setIsUserNameEffect(true);
                }
            }).catch(error => {
                console.log("에러내용:", JSON.stringify(error));
            })
        } else {
            setUserEmailMessage('필수 정보입니다.');
            setIsUserEmailEffect(false);
            nickNameRef.current.focus();
        }
    }

    const SignUpChangeEc = ({target: {value}}) => {
        setUserEmailChk(value);
    }

    const SignUpChangePh = useCallback((e) => {
        const userPhoneRegex = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
        const userPhoneCurrent = e.target.value;
        setUserPhone(userPhoneCurrent);

        if(userPhoneCurrent.length < 1) {
            setUserPhoneMessage('');
        } else {
            if (!userPhoneRegex.test(userPhoneCurrent)) {
                setUserPhoneMessage('형식에 맞지 않는 번호입니다.');
                setIsUserPhoneEffect(false);
            } else {
                setUserPhoneMessage('');
                setIsUserPhoneEffect(true);
            }
        }
    }, [])

    const userData = {
        userEmail: `${userEmail}`,
        userPw: `${userPw}`,
        userNickName: `${userNickName}`,
        userBirth: `${userBirthY}` + `${userBirthM}` + `${userBirthD}`,
    }

    const HandleEmailChkSend = () => {
        if(isUserEmailDuplicationEffect === true) {
            setIsUserEmailHideEffect(true);
            setUserEmailMessage('');
            axios({
                method: "GET",
                url: "/users/sendAuthCode",
                params: {userEmail: userEmail}
            }).then(function(obj) {
                alert('인증코드를 발송했습니다. 이메일을 확인해주세요.');
                setIsUserEmailEffect(true);
                console.log('2' + obj.data.authCode);
                setUserEmailCode(obj.data.authCode);
            }).catch(function(error) {
                alert('인증코드 발송에 실패했습니다.');
            })
        } else {
            setUserEmailMessage("이미 사용중인 이메일 ID 입니다.");
            setIsUserEmailEffect(false);
        }
    }

    const HandleEmailCheck = () => {
        if(userEmailChk.length < 1) {
            setUserEmailChkMessage('인증이 필요합니다.');
            setIsUserEmailChkEffect(false);
        } else {
            if(userEmailChk === userEmailCode) {
                setUserEmailChkMessage('인증되었습니다.');
                setIsUserEmailChkEffect(true);
            } else {
                setUserEmailChkMessage('인증에 실패했습니다.');
                setIsUserEmailChkEffect(false);
            }
        }
    }

    const HandleJoin = (e) => {
        // if(isUserIdEffect === false) {
        //     setUserIdMessage('필수 정보입니다.');
        //     setIsPasswordEffect(false);
        //     e.preventDefault();
        // } else
        if(userEmail.length < 1) {
            setUserEmailMessage('필수 정보입니다.');
            setIsUserEmailEffect(false);
            e.preventDefault();
        } else
        if(isUserEmailChkEffect === false) {
            setIsUserEmailEffect(false);
            if(isUserEmailHideEffect === true) {
                setUserEmailChkMessage('인증이 필요합니다.');
            } else {
                setUserEmailMessage('인증이 필요합니다.');
            }
            e.preventDefault();
        } else
        if(isPasswordEffect === false) {
            setUserPwMessage('필수 정보입니다.');
            setIsPasswordEffect(false);
            e.preventDefault();
        } else
        if(isPasswordConfirmEffect === false) {
            setUserPwChkMessage('비밀번호가 일치하지 않습니다.');
            setIsPasswordConfirmEffect(false);
            e.preventDefault();
        } else
        if(isUserNameEffect === false) {
            setUserNameMessage('필수 정보입니다.');
            setIsUserNameEffect(false);
            e.preventDefault();
        } else
        if(userBirthY.length < 1) {
            setUserBirthMessage('태어난 년도 4자리를 정확하게 입력하세요.');
            setIsUserBirthEffect(false);
            e.preventDefault();
        } else
        if(userBirthM.length < 1) {
            setUserBirthMessage('태어난 월을 선택하세요.');
            setIsUserBirthEffect(false);
            e.preventDefault();
        } else
        if(userBirthD.length < 1) {
            setUserBirthMessage('태어난 일(날짜) 2자리를 정확하게 입력하세요.');
            setIsUserBirthEffect(false);
            e.preventDefault();
        } else
        // if(isUserGenderEffect === false) {
        //     setUserGenderMessage('필수 정보입니다.');
        //     setIsUserGenderEffect(false);
        //     e.preventDefault();
        // } else
            {
            console.log(JSON.stringify(userData));
            axios({
                method: "POST",
                url: "/users/signUp",
                data: JSON.stringify(userData),
                headers: {'Content-type': 'application/json'}
            }).then(function() {
                window.alert("회원가입이 완료되었습니다");
                navigate("/");
            }).catch(function(error) {
                console.log("에러내용:", JSON.stringify(error));
            })
        }

    }

    return (
        <div>
            <div style={ {marginBottom:"55px"} }><h1>회원가입</h1></div>
            <Container className="panel">
                <Form onSubmit={HandleJoin}>
                    <Form.Group className="mb-3" controlId="userEmail">
                        <Col sm>
                            <Row>
                                <Form.Text className="text-muted" style={ {position:"relative", right:"173px", fontSize:"20px", fontWeight:"bold"} }>본인 확인 이메일</Form.Text>
                                <Form.Control type="userEmail" placeholder="이메일 주소" value={userEmail} onChange={SignUpChangeEm} onBlur={EmailDuplicationChk} ref={emailRef} style={ {width:"400px", height:"50px", marginLeft:"auto"} }/>
                                <Button variant="primary" onClick={HandleEmailChkSend} style={ {width:"100px", height:"50px", marginRight:"auto"} }>전송하기</Button>
                            </Row>
                            {(
                                <span style={ isUserEmailEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userEmailMessage}</span>
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group controlId="userEmailChk" style={ isUserEmailHideEffect ? {display:'block'} : {display:'none'} }>
                        <Col sm>
                            <Row>
                                <Form.Control type="userEmailChk" placeholder="인증번호를 입력하세요" value={userEmailChk} onChange={SignUpChangeEc} style={ {width:"400px", height:"50px", marginLeft:"auto"} }/>
                                <Button variant="primary" onClick={HandleEmailCheck} style={ {width:"100px", height:"50px", marginRight:"auto"} }>인증하기</Button>
                            </Row>
                            {(
                                <span style={ isUserEmailChkEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userEmailChkMessage}</span>
                            )}
                        </Col>
                    </Form.Group>

                    {/*<Form.Group className="mb-3" controlId="userId">
                        <Col sm>
                            <Form.Text className="text-muted" style={ {position:"relative", right:"220px", fontSize:"20px", fontWeight:"bold"} }>아이디</Form.Text>
                            <Form.Control type="userId" placeholder="아이디를 입력하세요" value={userId} onChange={SignUpChangeId} style={ {width:"500px", height:"50px", marginLeft:"auto", marginRight:"auto"} }/>
                            {(
                                <span style={ isUserIdEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userIdMessage}</span>
                            )}
                        </Col>
                    </Form.Group>*/}

                    <Form.Group className="mb-3" controlId="userPw">
                        <Col sm>
                            <Form.Text className="text-muted" style={ {position:"relative", right:"210px", fontSize:"20px", fontWeight:"bold"} }>비밀번호</Form.Text>
                            <Form.Control type="password" placeholder="비밀번호" value={userPw} onChange={SignUpChangePw} style={ {width:"500px", height:"50px", marginLeft:"auto", marginRight:"auto"} }/>
                            {(
                                <span style={ isPasswordEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userPwMessage}</span>
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userPwChk">
                        <Col sm>
                            <Form.Text className="text-muted" style={ {position:"relative", right:"177px", fontSize:"20px", fontWeight:"bold"} }>비밀번호 재확인</Form.Text>
                            <Form.Control type="password" placeholder="비밀번호 확인" value={userPwChk} onChange={SignUpChangePc} style={ {width:"500px", height:"50px", marginLeft:"auto", marginRight:"auto"} }/>
                            {(
                                <span style={ isPasswordConfirmEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userPwChkMessage}</span>
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="userNickName">
                        <Col sm>
                            <Form.Text className="text-muted" style={ {position:"relative", right:"230px", fontSize:"20px", fontWeight:"bold"} }>이름</Form.Text>
                            <Form.Control type="userNickName" placeholder="닉네임" value={userNickName} onChange={SignUpChangeNm} onBlur={nickNameDuplicationChk} ref={nickNameRef} style={ {width:"500px", height:"50px", marginLeft:"auto", marginRight:"auto"} }/>
                            {(
                                <span style={ isUserNameEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userNameMessage}</span>
                            )}
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Col sm>
                            <Row>
                                <Form.Text className="text-muted" style={ {position:"relative", right:"210px", fontSize:"20px", fontWeight:"bold"} }>생년월일</Form.Text>
                                <Form.Control type="userBirthY" itemID="userBirthY" placeholder="년(4자)" value={userBirthY} onChange={SignUpChangeBrY} style={ {width:"149px", height:"50px", marginLeft:"auto", marginRight:"27px"} }/>
                                {/*<Form.Control type="userBirthM" itemID="userBirthM" placeholder="월" value={userBirthM} onChange={SignUpChangeBrM} style={ {width:"149px", height:"50px"} }/>*/}
                                <Form.Select itemID="userBirthM" onChange={SignUpChangeBrM} style={ {width:"149px", height:"50px"} }>
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
                                </Form.Select>
                                <Form.Control type="userBirthD" itemID="userBirthD" placeholder="일" onChange={SignUpChangeBrD} style={ {width:"149px", height:"50px", marginLeft:"27px", marginRight:"auto"} }/>
                            </Row>
                            {(
                                <span style={ isUserBirthEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userBirthMessage}</span>
                            )}
                        </Col>
                    </Form.Group>

                    {/*<Form.Group className="mb-3" controlId="userGender">
                        <Col sm>
                            <Form.Text className="text-muted" style={ {position:"relative", right:"230px", fontSize:"20px", fontWeight:"bold"} }>성별</Form.Text>
                            <Form.Control type="userGender" placeholder="성별을 입력하세요" value={userGender} onChange={SignUpChangeGe} style={ {width:"500px", height:"50px", marginLeft:"auto", marginRight:"auto"} }/>
                            <Form.Select onChange={SignUpChangeGe} style={ {width:"500px", height:"50px", marginLeft:"auto", marginRight:"auto"} }>
                                <option value="">성별</option>
                                <option value="M">남자</option>
                                <option value="W">여자</option>
                                <option value="X">선택 안함</option>
                            </Form.Select>
                            {(
                                <span style={ isUserGenderEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userGenderMessage}</span>
                            )}
                        </Col>
                    </Form.Group>*/}

                    {/*<Form.Group className="mb-3" controlId="userPhone">
                        <Col sm>
                            <Form.Text className="text-muted" style={ {position:"relative", right:"182px", fontSize:"20px", fontWeight:"bold"} }>휴대전화(선택)</Form.Text>
                            <Form.Control type="userPhone" placeholder="휴대폰 번호를 입력하세요" value={userPhone} onChange={SignUpChangePh} style={ {width:"500px", height:"50px", marginLeft:"auto", marginRight:"auto"} }/>
                            {(
                                <span style={ isUserPhoneEffect ? { color:'green', fontSize:'16px'} : {color:'red', fontSize:'16px'} }>{userPhoneMessage}</span>
                            )}
                        </Col>
                    </Form.Group>*/}

                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="primary" type="submit">가입하기</Button>
                    </div>
                    <div className="d-grid gap-1" style={ {margin:"5px"} }>
                        <Button variant="secondary" href="/">취소</Button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}

export default SignUp;