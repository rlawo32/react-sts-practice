import MainView from "../Layouts/MainView";
import {useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {setCookie} from "./Cookie";

const MainHome = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [easyLoginState, setEasyLoginState] = useState(false);

    useEffect(() => {
        if(searchParams.get("bearer") === "Bearer") {
            // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
            axios.defaults.headers.common['Authorization'] = `${searchParams.get("bearer")} ${searchParams.get("accessToken")}`;

            const expires = new Date(searchParams.get("expires"));

            // refreshToken은 cookie에 담아놓기
            setCookie('refreshToken', `${searchParams.get("refreshToken")}`, {
                path: '/',
                // httpOnly: true,
                expires
            });

            setEasyLoginState(!easyLoginState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(easyLoginState) {
            setSearchParams("");
            setEasyLoginState(!easyLoginState);
            window.location.reload();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [easyLoginState])

    return (
        <>
            <MainView />
        </>
    )
}

export default MainHome;