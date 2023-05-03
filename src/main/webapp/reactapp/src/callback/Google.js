import React, { useContext, useEffect } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/LoginContext";

export default function Google() {
    const { accessToken, setAccessToken, loginType, setLoginType } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {

    }, []);

    return <div>Google Callback</div>
}