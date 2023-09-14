import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";
import cookie from "react-cookies";
import {useEffect, useState} from "react";
import axios from "axios";

export default function ButtonAppBar() {

    const [isLoginCheck, setIsLoginCheck] = useState(0);;

    const logout = () => {
        cookie.remove('refreshToken');
        window.location.reload();
    }

    const memberInfo = () => {

    }

    useEffect(() => {
        if(cookie.load("refreshToken")) {
            setIsLoginCheck(1);
        } else {
            setIsLoginCheck(0);
        }
    }, [isLoginCheck])

    return (
        <AppBar sx={{height: 55, backgroundColor:'rgba(153, 153, 153, 0.1)'}}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="menu"
                    sx={{ mr: 2, color: "white" }}
                >
                    <Link to="/">
                        <MenuIcon />
                    </Link>
                </IconButton>
                <Typography position="relative" variant="h6" component="div" sx={{ flexGrow: 1, color: "white" }}>

                </Typography>

                {
                    `${isLoginCheck}` == 1 ?
                        <span>
                            <Link to="/memberInfo">
                                <Button sx={{color: "white"}} onClick={() => memberInfo()}>내 정보</Button>
                            </Link>
                            <Link to="/">
                                <Button sx={{color: "white"}} onClick={() => logout()}>로그아웃</Button>
                            </Link>
                        </span>
                        :
                        <span>
                            <Link to="/signIn">
                                <Button sx={{color: "white"}}>로그인</Button>
                            </Link>
                            <Link to="/signUp">
                                <Button sx={{color: "white"}}>회원가입</Button>
                            </Link>
                        </span>
                }

                <Link to="/board" state={{ mainReset: null }}>
                    <Button sx={{color: "white"}}>게시판</Button>
                </Link>
            </Toolbar>
        </AppBar>
    );
}