import React, {useEffect, useRef} from "react";
import space1 from "../../images/space1.jpg";
import space3 from "../../images/space3.jpg";
import space4 from "../../images/space4.jpg";
import space5 from "../../images/space5.jpg";
import space6 from "../../images/space6.jpg";
import './MainView.scss';
import AnimatedCursor from "react-animated-cursor";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from '@fortawesome/free-brands-svg-icons';
import DrawWord from './DrawWord';
import AppBarNavigation from "../Navigation/AppBarNavigation";

const MainView = () => {

    const divRef1 = useRef();
    const divRef2 = useRef();
    const divRef3 = useRef();
    // const divRef4 = useRef();

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
        // scrollObserver.observe(divRef4.current);
    }, [])

    return (
        <>
            <AppBarNavigation />
            {/*<AnimatedCursor*/}
            {/*    innerSize={20}*/}
            {/*    outerSize={35}*/}
            {/*    innerScale={2}*/}
            {/*    outerScale={1.7}*/}
            {/*    outerAlpha={0}*/}
            {/*    innerStyle={*/}
            {/*        { backgroundColor: 'var(--cursor-color)' }*/}
            {/*    }*/}
            {/*/>*/}
            <div className="Main-body">
                {/*<div style={ {backgroundImage: `url(${space2})`, height: '1000px'} }>*/}
                {/*    /!*<span style={ {lineHeight: '500px'} }>Hello</span>*!/*/}
                {/*</div>*/}

                {/*<DrawWord />*/}
                <div className="Main-view">
                    <div className="First-view">
                        {/*<svg viewBox="-150 0 1040 320">*/}
                        {/*    <text x="0" y="50%">W</text>*/}
                        {/*    <text x="130" y="50%">E</text>*/}
                        {/*    <text x="230" y="50%">L</text>*/}
                        {/*    <text x="330" y="50%">C</text>*/}
                        {/*    <text x="430" y="50%">O</text>*/}
                        {/*    <text x="530" y="50%">M</text>*/}
                        {/*    <text x="660" y="50%">E</text>*/}
                        {/*</svg>*/}

                        <DrawWord />
                    </div>

                    <div className="Second-view" style={ {fontFamily: "'Leckerli One', cursive"} }>
                        HELLO
                    </div>
                </div>

                <div className="Sub-view" ref={divRef1}>Hello, Nice Day !!</div>
                <div className="Sub-view" ref={divRef2}>League of Legend !!</div>
                <div className="Sub-view" ref={divRef3}>
                    <img src={space1} alt="space1" />
                </div>


                <div className="Social-logo">
                    <div style={ {borderBottom: "1px inset white", marginBottom: "50px", width: "60%", marginLeft: "auto", marginRight: "auto"} } />
                    <Link to="https://github.com/" style={ {color: "white" ,marginRight: "200px"} }>
                        <FontAwesomeIcon className="link-style" icon={faGithubSquare} />
                    </Link>
                    <Link to="https://www.youtube.com/" style={ {color: "white"} }>
                        <FontAwesomeIcon className="link-style" icon={faYoutubeSquare} />
                    </Link>
                </div>
            </div>
        </>
    )

}

export default MainView;