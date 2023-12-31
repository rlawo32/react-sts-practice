import * as React from 'react';
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithubSquare, faYoutubeSquare} from "@fortawesome/free-brands-svg-icons";

export default function ButtonFooter() {
    return (
        <div className="Social-logo">
            <div style={ {borderBottom: "1px inset white", marginBottom: "50px", width: "60%", marginLeft: "auto", marginRight: "auto"} } />
            <Link to="https://github.com/" style={ {color: "white" ,marginRight: "200px"} }>
                <FontAwesomeIcon className="link-style" icon={faGithubSquare} />
            </Link>
            <Link to="https://www.youtube.com/" style={ {color: "white"} }>
                <FontAwesomeIcon className="link-style" icon={faYoutubeSquare} />
            </Link>
        </div>
    );
}