import React, {useEffect} from "react";
import './BoardDetailRemote.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBackward as backwardBtn,
    faForward as forwardBtn,
    faHouse as homeBtn,
    faCircleUp as topBtn,
    faCircleDown as bottomBtn
} from "@fortawesome/free-solid-svg-icons"
import {useNavigate} from "react-router-dom";

const BoardDetailRemote = () => {

    const navigate = useNavigate();

  useEffect( () => {

  }, []);

  return (
      <div className="remote-control">
          <div className="inside-rectangle">
              <FontAwesomeIcon icon={homeBtn} className="center-design"
                               onClick={() => navigate("/")}/>
          </div>
          <div className="inside-diagonal-1" />
          <div className="inside-diagonal-2" />
          <div className="top-button">
              <FontAwesomeIcon icon={topBtn} className="top-design"
                               onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}/>
          </div>
          <div className="bottom-button">
              <FontAwesomeIcon icon={bottomBtn} className="bottom-design"
                               onClick={() => window.scrollTo({ top: 5000, behavior: "smooth" })}/>
          </div>
          <div className="left-button">
              <FontAwesomeIcon icon={backwardBtn} className="left-design"
                               onClick={() => navigate(-1)}/>
          </div>
          <div className="right-button">
              <FontAwesomeIcon icon={forwardBtn} className="right-design"
                               onClick={() => navigate(1)}/>
          </div>
      </div>
  )
}

export default BoardDetailRemote;