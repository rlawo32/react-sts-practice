import React, {useEffect, useState} from "react";
import "./MemberInfo.scss";
import '../Layouts/MainView.scss'
import axios from "axios";

const MemberInfoLoginLog = () => {

    useEffect(() => {

    }, [])

    return (
        <div className="member-info">

            <h3>로그인 기록</h3>

            <div className="loginLog-view">


            </div>

        </div>
    )
}

export default MemberInfoLoginLog;