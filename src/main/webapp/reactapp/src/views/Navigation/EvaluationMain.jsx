import React, {useEffect, useState} from "react";
import axios from "axios";
import "./EvaluationMain.scss";
import {Link, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar as fullStar, faStarHalfStroke as halfStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import HeaderNavigation from "./../Navigation/HeaderNavigation";
import FooterNavigation from "./../Navigation/FooterNavigation";
import EvaluationWrite from "./EvaluationWrite";
import DrawLoader from "../Layouts/DrawLoader";

const EvaluationMain = () => {
    const navigate = useNavigate();

    const [pageNo, setPageNo] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [evaluationModal, setEvaluationModal] = useState(false);
    const [totalFunctionRating, setTotalFunctionRating] = useState(0);
    const [totalDesignRating, setTotalDesignRating] = useState(0);

    const [isViewLoading, setIsViewLoading] = useState(false);

    const [evaluationList, setEvaluationList] = useState([{
        evaluationNo: '',
        evaluationId: '',
        evaluationMemberId: '',
        evaluationMemberNickname: '',
        evaluationFunctionRating: '',
        evaluationDesignRating: '',
        evaluationTitle: '',
        evaluationContent: '',
        evaluationLoginYn: '',
        createdDate: ''
    }]);

    const pagination = () => {
        let result = [];
        for (let i=0; i<totalPage; i++) {
            result.push(<li key={i} onClick={() => setPageNo(i)}><button className="list-item">{i+1}</button></li>);
        }
        return result;
    }

    const totalFunctionRatingStarViewHandler = () => {
        const total = totalFunctionRating / totalData;
        let result = [];
        for (let i=0; i<5; i++) {
            result.push(
                <span key={i+1} className="rating">
                        {
                            i+1 <= total ?
                                <FontAwesomeIcon icon={fullStar} />
                                :
                                i+0.5 == total.toFixed(1) ?
                                    <FontAwesomeIcon icon={halfStar} />
                                    :
                                    i+1 <= Math.round(total).toFixed(1) ?
                                        <FontAwesomeIcon icon={halfStar} />
                                        :
                                        <FontAwesomeIcon icon={emptyStar} />
                        }
                    </span>);
        }
        return result;
    }

    const totalDesignRatingStarViewHandler = () => {
        const total = totalDesignRating / totalData;
        let result = [];
        for (let i=0; i<5; i++) {
            result.push(
                <span key={i+1} className="rating">
                        {
                            i+1 <= total ?
                                <FontAwesomeIcon icon={fullStar} />
                                :
                                i+0.5 == total.toFixed(1) ?
                                    <FontAwesomeIcon icon={halfStar} />
                                    :
                                    i+1 <= Math.round(total).toFixed(1) ?
                                        <FontAwesomeIcon icon={halfStar} />
                                        :
                                        <FontAwesomeIcon icon={emptyStar} />
                        }
                    </span>);
        }
        return result;
    }

    const ratingStarViewHandler = (e) => {
        let result = [];
        for (let i=0; i<5; i++) {
            result.push(
                <span key={i+1} className="rating">
                        {
                            i+1 <= e ?
                                <FontAwesomeIcon icon={fullStar} />
                                :
                                <FontAwesomeIcon icon={emptyStar} />
                        }
                    </span>);
        }
        return result;
    }

    useEffect(() => {
        const paging = {
            recordPerPage: 5,
            page: pageNo
        }

        axios({
            method: 'GET',
            url: 'evaluation/evaluationList',
            params: paging
        }).then((res) => {
            setEvaluationList(res.data.evaluationList);
            setTotalPage(res.data.totalPage);
            setTotalData(res.data.totalData);
            setTotalFunctionRating(res.data.totalFunctionRating);
            setTotalDesignRating(res.data.totalDesignRating);
        })

        setTimeout(() => {setIsViewLoading(true)}, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [evaluationModal, pageNo])

    return (
        <div className="evaluation-main">
            <HeaderNavigation />

            <div className="component-loading" style={isViewLoading?{display:'none'}:{display:'block'}}>
                <DrawLoader className="evaluation-view-loading" />
            </div>
            <div className="evaluation-view">
                <div className="evaluation-box">
                    <div className="evaluation-view-header">
                        <div className="evaluation-view-total-function">
                            <span className="view-total-function-text">기능</span>
                            <span className="view-total-function-rating">{totalFunctionRatingStarViewHandler()}</span>
                            <span className="view-total-function-score">
                            {
                                totalData != 0 ?
                                    (totalFunctionRating / totalData).toFixed(1)
                                    :
                                    0
                            }
                        </span>
                        </div>
                        <div className="evaluation-view-total-design">
                            <span className="view-total-design-text">디자인</span>
                            <span className="view-total-design-rating">{totalDesignRatingStarViewHandler()}</span>
                            <span className="view-total-design-score">
                            {
                                totalData != 0 ?
                                    (totalDesignRating / totalData).toFixed(1)
                                    :
                                    0
                            }
                        </span>
                        </div>
                        <div className="evaluation-view-write">
                            <span className="view-total-count">{totalData}개의 평가가 있습니다.</span>
                            <button onClick={() => setEvaluationModal(true)}>작성하기</button>
                        </div>
                        {evaluationModal ? <EvaluationWrite setEvaluationModal={setEvaluationModal} /> : null}
                    </div>
                    <div className="evaluation-view-body">
                        <div className="evaluation-view-list">
                            {evaluationList.map((evaluations) => (
                                <div key={evaluations.evaluationId} className="evaluation-view-box">
                                    <div className="view-header">
                                    <span className="view-function-rating">
                                        <span className="view-function-text">기능</span>
                                        <span>{ratingStarViewHandler(`${evaluations.evaluationFunctionRating}`)}</span>
                                    </span>
                                        <span className="view-design-rating">
                                        <span className="view-design-text">디자인</span>
                                        <span>{ratingStarViewHandler(`${evaluations.evaluationDesignRating}`)}</span>
                                    </span>
                                        <span className="view-nickname">
                                        {evaluations.evaluationMemberNickname}
                                    </span>
                                        <span className="view-date">
                                        {evaluations.createdDate.substring(0, 11)}
                                    </span>
                                    </div>
                                    <div className="view-title">
                                        {evaluations.evaluationTitle}
                                    </div>
                                    <div className="view-content">
                                        {evaluations.evaluationContent}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="evaluation-paging">
                        <ul>
                            {pagination()}
                        </ul>
                    </div>
                </div>
            </div>

            <FooterNavigation />
        </div>
    )
}

export default EvaluationMain;