import React, {useEffect} from "react";
import {useLocation, useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";

const OauthSignIn = (props) => {
    // const searchParams = useLocation();
    // const obj = searchParams.search;

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {

        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${searchParams.get("accessToken")}`;

        const expires = Date.now() + (86400 * 10000);

        // refreshToken은 cookie에 담아놓기
        // cookie.save('refreshToken', ${searchParams.get("accessToken")}, {
        //     path: '/',
        //     // httpOnly: true,
        //     expires
        // });

        console.log(Date.now());

    }, [])

    return (
        <div>
            <h1>Hello, World!!</h1>
        </div>
    )
}

export default OauthSignIn;