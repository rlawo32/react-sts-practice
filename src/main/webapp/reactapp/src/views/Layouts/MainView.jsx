import React, {useEffect, useRef, useState} from "react";
import './MainView.scss';
import DrawWord from './DrawWord';
import MainBackground from "../Navigation/MainBackground";
import AppBarNavigation from "../Navigation/HeaderNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";
import {useNavigate} from "react-router-dom";

const MainView = () => {
    const navigate = useNavigate();

    const divRef1 = useRef();
    const divRef2 = useRef();
    const divRef3 = useRef();
    const divRef4 = useRef();
    const divRef5 = useRef();
    const divRef6 = useRef();

    const [isEvaluationView, setIsEvaluationView] = useState(false);

    // const lineRef1 = useRef();

    useEffect(() => {
        const scrollObserver = new IntersectionObserver((e) => {
            e.forEach((div) => {
                if(div.isIntersecting) {
                    div.target.style.opacity = 1;
                } else {
                    div.target.style.opacity = 0;
                }
            })
        })

        scrollObserver.observe(divRef1.current);
        scrollObserver.observe(divRef2.current);
        scrollObserver.observe(divRef3.current);
        scrollObserver.observe(divRef4.current);
        scrollObserver.observe(divRef5.current);
        scrollObserver.observe(divRef6.current);

        setTimeout(() => {setIsEvaluationView(true);}, 6000);

        // lineObserver1.observe(lineRef1.current);
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
                            <button>
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

                <div className="Sub-view">

                    <div className="image-view">
                        <div className="image-1" ref={divRef1}>

                        </div>

                        <div className="image-2" ref={divRef2}>
                        </div>

                        <div className="image-3" ref={divRef3}>
                        </div>

                        <div className="image-4" ref={divRef4}>
                        </div>

                        <div className="image-5" ref={divRef5}>
                        </div>

                        <div className="image-6" ref={divRef6}>
                        </div>
                    </div>
                </div>

            </div>
            <FooterNavigation />
        </>
    )

}

export default MainView;