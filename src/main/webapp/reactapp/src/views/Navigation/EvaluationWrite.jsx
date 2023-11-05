import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import "./EvaluationMain.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as fullStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import {getCookie} from "./Cookie";

const EvaluationWrite = (props) => {
    const modalRef = useRef();

    const [isLoginCheck, setIsLoginCheck] = useState(0);
    const [evaluationNickname, setEvaluationNickname] = useState("");
    const [evaluationFunctionRating, setEvaluationFunctionRating] = useState(0);
    const [evaluationDesignRating, setEvaluationDesignRating] = useState(0);
    const [evaluationTitle, setEvaluationTitle] = useState("");
    const [evaluationContent, setEvaluationContent] = useState("");

    const functionRatingStarActionHandler = () => {
        let result = [];
        for (let i=0; i<5; i++) {
            result.push(
                    <span key={i+1} onClick={() => setEvaluationFunctionRating(i+1)} className="rating">
                        {
                            i+1 <= evaluationFunctionRating ?
                                <FontAwesomeIcon icon={fullStar} />
                                :
                                <FontAwesomeIcon icon={emptyStar} />
                        }
                    </span>);
        }
        return result;
    }

    const designRatingStarActionHandler = () => {
        let result = [];
        for (let i=0; i<5; i++) {
            result.push(
                <span key={i+1} onClick={() => setEvaluationDesignRating(i+1)} className="rating">
                        {
                            i+1 <= evaluationDesignRating ?
                                <FontAwesomeIcon icon={fullStar} />
                                :
                                <FontAwesomeIcon icon={emptyStar} />
                        }
                    </span>);
        }
        return result;
    }

    const evaluationSubmitHandler = () => {

        if(isLoginCheck == 1) {
            const evaluationData = {
                evaluationFunctionRating: `${evaluationFunctionRating}`,
                evaluationDesignRating: `${evaluationDesignRating}`,
                evaluationTitle: `${evaluationTitle}`,
                evaluationContent: `${evaluationContent}`
            };

            axios({
                method: 'POST',
                url: '/evaluation/evaluationSave',
                data: JSON.stringify(evaluationData),
                headers: {'Content-type': 'application/json'}
            }).then((res) => {
                window.alert("등록되었습니다.");
                props.setEvaluationModal(false);
            })
        } else {
            const evaluationData = {
                evaluationMemberNickname: `${evaluationNickname}`,
                evaluationFunctionRating: `${evaluationFunctionRating}`,
                evaluationDesignRating: `${evaluationDesignRating}`,
                evaluationTitle: `${evaluationTitle}`,
                evaluationContent: `${evaluationContent}`
            };

            axios({
                method: 'POST',
                url: '/evaluation/evaluationSave',
                data: JSON.stringify(evaluationData),
                headers: {'Content-type': 'application/json'}
            }).then((res) => {
                window.alert("등록되었습니다.");
                props.setEvaluationModal(false);
            })
        }
    }

    useEffect(() => {
        if(getCookie('refreshToken')) {
            setIsLoginCheck(1); // 로그인
        } else {
            setIsLoginCheck(0); // 비로그인
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div ref={modalRef} className="evaluation-write" style={isLoginCheck == 1 ? {}:{height:'825px'}}>
            <div className="evaluation-rating">
                <div className="evaluation-rating-header">
                    별점
                </div>
                <div className="evaluation-rating-body">
                    <div className="rating-text-view">
                        <div>
                            기능
                        </div>
                        <div>
                            디자인
                        </div>
                    </div>
                    <div className="rating-star-view">
                        <div>{functionRatingStarActionHandler()}</div>
                        <div>{designRatingStarActionHandler()}</div>
                    </div>
                </div>
            </div>
            <div className="evaluation-input" style={isLoginCheck == 1 ? {}:{height:'490px'}}>
                <div className="evaluation-input-header">

                </div>
                <div className="evaluation-input-body">
                    {
                        isLoginCheck == 1 ?
                            null
                            :
                            <div className="evaluation-input-nickname">
                                <div className="evaluation-input-nickname-header">이름</div>
                                <input type="text" value={evaluationNickname} placeholder="이름을 입력해주세요."
                                       onChange={(e) =>setEvaluationNickname(e.target.value)}/>
                            </div>
                    }
                    <div className="evaluation-input-title">
                        <div className="evaluation-input-title-header">제목</div>
                        <input type="text" value={evaluationTitle} placeholder="제목을 입력해주세요."
                               onChange={(e) =>setEvaluationTitle(e.target.value)}/>
                    </div>
                    <div className="evaluation-input-content">
                        <div className="evaluation-input-content-header">내용</div>
                        <textarea value={evaluationContent} placeholder="내용을 입력해주세요."
                               onChange={(e) =>setEvaluationContent(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="evaluation-button">
                <span className="evaluation-button-cancel">
                    <button onClick={() => props.setEvaluationModal(false)}>취소</button>
                </span>
                <span className="evaluation-button-submit">
                    <button onClick={() => evaluationSubmitHandler()}>등록</button>
                </span>
            </div>
        </div>
    )
}

export default EvaluationWrite;