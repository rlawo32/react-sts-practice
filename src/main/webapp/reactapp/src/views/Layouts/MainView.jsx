import React, {useEffect, useRef} from "react";
import './MainView.scss';
import logo_1 from '../../images/leagueoflegend_logo.png';
import logo_2 from '../../images/overwatch_logo2.jpg';
import logo_3 from '../../images/battleground_logo.png';
import logo_4 from '../../images/maplestory_logo.jpg';
import logo_5 from '../../images/minecraft_logo.png';
import logo_6 from '../../images/steam_logo.png';
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
                        HELLO
                    </div>
                </div>

                <div className="Sub-view">
                    <div className="image-view">
                        <div className="image-1" ref={divRef1}>
                            <img src={logo_1} alt="" className="logo-1" />
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
                            <img src={logo_2} alt="" className="logo-2" />
                        </div>

                        <div className="image-3" ref={divRef3}>
                            <img src={logo_3} alt="" className="logo-3" />
                        </div>

                        <div className="image-4" ref={divRef4}>
                            <img src={logo_4} alt="" className="logo-4" />
                        </div>

                        <div className="image-5" ref={divRef5}>
                            <img src={logo_5} alt="" className="logo-5" />
                        </div>

                        <div className="image-6" ref={divRef6}>
                            <img src={logo_6} alt="" className="logo-6" />
                        </div>
                    </div>
                </div>

            </div>
            <FooterNavigation />
        </>
    )

}

export default MainView;