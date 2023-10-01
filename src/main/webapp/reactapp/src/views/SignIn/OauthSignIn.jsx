import React, {useEffect} from "react";
import {Link, useLocation, useParams, useSearchParams} from "react-router-dom";
import axios from "axios";
import cookie from "react-cookies";

const OauthSignIn = (props) => {

    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {

        // API 요청하는 콜마다 헤더에 accessToken 담아 보내도록 설정
        axios.defaults.headers.common['Authorization'] = `${searchParams.get("bearer")} ${searchParams.get("accessToken")}`;

        const expires = new Date(searchParams.get("expires"));

        // refreshToken은 cookie에 담아놓기
        cookie.save('refreshToken', `${searchParams.get("refreshToken")}`, {
            path: '/',
            // httpOnly: true,
            expires
        });

    }, [])

    return (
        <div>
            <h1>Hello, World!!</h1>
            <Link to="/">
                HOME
            </Link>
        </div>
    )
}

export default OauthSignIn;