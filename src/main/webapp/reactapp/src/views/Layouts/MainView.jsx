import React, {useEffect, useRef} from "react";
import './MainView.scss';
import DrawWord from './DrawWord';
import AppBarNavigation from "../Navigation/HeaderNavigation";
import FooterNavigation from "../Navigation/FooterNavigation";

const MainView = () => {

    const divRef1 = useRef();
    const divRef2 = useRef();
    const divRef3 = useRef();
    const divRef4 = useRef();
    const divRef5 = useRef();
    const divRef6 = useRef();

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

        // const lineObserver1 = new IntersectionObserver((e) => {
        //     if(e[0].isIntersecting) {
        //         e[0].target.children[2].style.right = "0%";
        //         e[0].target.children[2].style.transitionDelay = "4.5s";
        //         e[0].target.children[3].style.bottom = "0%";
        //         e[0].target.children[3].style.transitionDelay = "0s";
        //     } else {
        //         e[0].target.children[2].style.right = "100%";
        //         e[0].target.children[2].style.transitionDelay = "0s";
        //         e[0].target.children[3].style.bottom = "100%";
        //         e[0].target.children[3].style.transitionDelay = "0s";
        //     }
        // })

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
                        <video autoPlay loop muted height={"1060px"} >
                            <source src="https://bit.ly/3kYMF9A" type="video/mp4"/>
                            Your browser is not supported!
                        </video>
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
                    </div>
                </div>

                <div className="Sub-view">

                    {/*<div className="image-view">*/}
                    {/*    <video autoPlay loop muted height={"1000px"} >*/}
                    {/*        <source src="https://bit.ly/3kYMF9A" type="video/mp4"/>*/}
                    {/*        Your browser is not supported!*/}
                    {/*    </video>*/}
                    {/*</div>*/}

                    <div className="image-view">
                        <div className="image-1" ref={divRef1}>

                        </div>
                        {/*<div className="test-box">*/}
                        {/*    <div className="line-draw-1" ref={lineRef1}>*/}
                        {/*        check*/}
                        {/*        <span></span>*/}
                        {/*        <span></span>*/}
                        {/*        <span></span>*/}
                        {/*        <span></span>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

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