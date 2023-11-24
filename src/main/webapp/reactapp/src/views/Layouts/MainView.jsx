import React, {useEffect, useState} from "react";
import './MainView.scss';
import DrawWord from './DrawWord';
import MainBackground from "../Navigation/MainBackground";
import AppBarNavigation from "../Navigation/HeaderNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import {useNavigate} from "react-router-dom";

const MainView = () => {
    const navigate = useNavigate();

    const [isEvaluationView, setIsEvaluationView] = useState(false);

    useEffect(() => {

        setTimeout(() => {setIsEvaluationView(true);}, 6000);
    }, [])

    return (
        <>
            <AppBarNavigation />
            <div className="Main-body">
                <div className="Main-view">
                    <div className="First-view">
                        <DrawWord />
                    </div>

                    <div className="Second-view">
                        <div className={isEvaluationView?"evaluation-view slide-design":"evaluation-view"} >
                            <span>이 웹사이트를 평가해주세요!</span>
                            <button onClick={() => navigate("/evaluationMain")}>평가하러 가기</button>
                        </div>
                        <MainBackground />
                        <div className="Second-view-text">
                            <h1 style={{fontWeight: "bold", fontSize: "55px"}}>WELCOME MY WEB SITE</h1>
                            <h4 style={{fontWeight: "bold", fontSize: "25px"}}>MORE FUN, MORE INTERSTED</h4>
                            <p style={{marginTop: "20px", fontSize: "15px"}}>
                                This site is for communication about games. <br />
                                You can share various information about the game and also enjoy small games.
                            </p>
                            <button onClick={() => alert('개발 중...')}>
                                JOIN
                            </button>
                        </div>
                        <div className="bounce-design">
                            <div className="bounce-design__item">개</div>
                            <div className="bounce-design__item">발</div>
                            <div className="bounce-design__item">I</div>
                            <div className="bounce-design__item">N</div>
                            <div className="bounce-design__item">G</div>
                            <div className="bounce-design__item">.</div>
                            <div className="bounce-design__item">.</div>
                            <div className="bounce-design__item">.</div>
                        </div>
                    </div>
                </div>

                <FooterNavigation />
            </div>
        </>
    )

}

export default MainView;